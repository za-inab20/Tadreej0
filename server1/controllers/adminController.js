import CourseModel from '../models/CourseModel.js';
import FreelancerModel from '../models/FreelancerModel.js';
import UserModel from '../models/UserModel.js';

const resolveDisplayedFreelancerStatus = (user) => {
  if ((user.accountType || 'user') !== 'freelancer') return 'not_requested';
  return user.freelancerApprovalStatus || 'pending';
};

const sanitizeUser = (user) => ({
  _id: user._id,
  uname: user.uname,
  email: user.email,
  profilepic: user.profilepic,
  role: user.role,
  accountType: user.accountType || 'user',
  freelancerApprovalStatus: resolveDisplayedFreelancerStatus(user),
  theme: user.theme || 'light',
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const normalizeSkills = (skills) => {
  if (Array.isArray(skills)) {
    return skills.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof skills === 'string') {
    return skills
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const getMonthRange = (date = new Date()) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start, end };
};

const resolveFreelancerApprovalStatus = (accountType, requestedStatus, currentStatus) => {
  if (accountType !== 'freelancer') {
    return 'not_requested';
  }

  if (['pending', 'approved', 'rejected'].includes(requestedStatus)) {
    return requestedStatus;
  }

  if (['pending', 'approved', 'rejected'].includes(currentStatus)) {
    return currentStatus;
  }

  return 'pending';
};

const syncOwnedFreelancerVisibility = async (user) => {
  const shouldBePublic = user.accountType === 'freelancer' && user.freelancerApprovalStatus === 'approved';

  await FreelancerModel.updateMany(
    { ownerId: user._id },
    {
      $set: {
        ownerEmail: user.email,
        publicVisibility: shouldBePublic ? 'public' : 'private',
        verified: shouldBePublic,
      },
    }
  );
};

const mapFreelancer = (freelancer) => {
  const item = freelancer.toObject ? freelancer.toObject() : { ...freelancer };

  return {
    ...item,
    ownerId: item.ownerId?._id || item.ownerId || null,
    ownerName: item.ownerId?.uname || item.ownerName || '',
    ownerApprovalStatus: item.ownerId?.freelancerApprovalStatus || '',
    ownerEmail: item.ownerEmail || item.ownerId?.email || '',
    sourceType: item.sourceType || 'admin',
    publicVisibility: item.publicVisibility || 'public',
  };
};

export const getDashboardOverview = async (req, res) => {
  try {
    const [
      usersCount,
      adminsCount,
      freelancersCount,
      coursesCount,
      pendingFreelancerApprovals,
      approvedFreelancerUsers,
      recentUsers,
      recentCourses,
      recentFreelancers,
    ] = await Promise.all([
      UserModel.countDocuments(),
      UserModel.countDocuments({ role: 'admin' }),
      FreelancerModel.countDocuments(),
      CourseModel.countDocuments(),
      UserModel.countDocuments({ accountType: 'freelancer', freelancerApprovalStatus: 'pending' }),
      UserModel.countDocuments({ accountType: 'freelancer', freelancerApprovalStatus: 'approved' }),
      UserModel.find({}).select('-password').sort({ createdAt: -1 }).limit(5),
      CourseModel.find({}).sort({ createdAt: -1 }).limit(5),
      FreelancerModel.find({}).populate('ownerId', 'uname email freelancerApprovalStatus').sort({ createdAt: -1 }).limit(5),
    ]);

    return res.status(200).json({
      metrics: {
        usersCount,
        adminsCount,
        freelancersCount,
        coursesCount,
        pendingFreelancerApprovals,
        approvedFreelancerUsers,
      },
      recentUsers: recentUsers.map(sanitizeUser),
      recentCourses,
      recentFreelancers: recentFreelancers.map(mapFreelancer),
    });
  } catch (error) {
    console.error('Get Dashboard Overview Error:', error);
    return res.status(500).json({ message: 'Server error fetching dashboard overview' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}).select('-password').sort({ createdAt: -1 });
    return res.status(200).json(users.map(sanitizeUser));
  } catch (error) {
    console.error('Get All Users Error:', error);
    return res.status(500).json({ message: 'Server error fetching users' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { uname, email, role, accountType, freelancerApprovalStatus } = req.body;

    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const previousEmail = user.email;

    if (email && email !== user.email) {
      const normalizedEmail = String(email).toLowerCase().trim();
      const existingUser = await UserModel.findOne({ email: normalizedEmail });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(409).json({ message: 'Email already in use' });
      }
      user.email = normalizedEmail;
    }

    if (uname) {
      user.uname = uname;
    }

    if (role && ['user', 'admin'].includes(role)) {
      user.role = role;
    }

    const nextAccountType = accountType && ['user', 'freelancer'].includes(accountType)
      ? accountType
      : user.accountType || 'user';

    user.accountType = nextAccountType;
    user.freelancerApprovalStatus = resolveFreelancerApprovalStatus(
      nextAccountType,
      freelancerApprovalStatus,
      user.freelancerApprovalStatus
    );

    await user.save();

    if (user.email !== previousEmail) {
      await FreelancerModel.updateMany({ ownerId: user._id }, { $set: { ownerEmail: user.email } });
    }

    await syncOwnedFreelancerVisibility(user);

    return res.status(200).json({ message: 'User updated successfully', user: sanitizeUser(user) });
  } catch (error) {
    console.error('Update User Error:', error);
    return res.status(500).json({ message: 'Server error updating user' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.email === req.adminUser.email) {
      return res.status(400).json({ message: 'You cannot delete the currently logged-in admin account' });
    }

    await FreelancerModel.deleteMany({ ownerId: user._id });
    await user.deleteOne();
    return res.status(200).json({ message: 'User removed' });
  } catch (error) {
    console.error('Delete User Error:', error);
    return res.status(500).json({ message: 'Server error deleting user' });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await CourseModel.find({}).sort({ createdAt: -1 });
    return res.status(200).json(courses);
  } catch (error) {
    console.error('Get All Courses Error:', error);
    return res.status(500).json({ message: 'Server error fetching courses' });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, instructor, rating, reviews, price, duration, category, level, description, isPublished } = req.body;

    if (!title || !instructor || price === undefined || !duration || !category || !level) {
      return res.status(400).json({ message: 'Title, instructor, price, duration, category, and level are required' });
    }

    const course = await CourseModel.create({
      title,
      instructor,
      rating: Number(rating || 0),
      reviews: Number(reviews || 0),
      price: Number(price),
      duration,
      category,
      level,
      description: description || '',
      isPublished: isPublished !== false,
    });

    return res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    console.error('Create Course Error:', error);
    return res.status(500).json({ message: 'Server error creating course' });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await CourseModel.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const fields = ['title', 'instructor', 'duration', 'category', 'level', 'description'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        course[field] = req.body[field];
      }
    });

    if (req.body.rating !== undefined) course.rating = Number(req.body.rating);
    if (req.body.reviews !== undefined) course.reviews = Number(req.body.reviews);
    if (req.body.price !== undefined) course.price = Number(req.body.price);
    if (req.body.isPublished !== undefined) course.isPublished = Boolean(req.body.isPublished);

    await course.save();
    return res.status(200).json({ message: 'Course updated successfully', course });
  } catch (error) {
    console.error('Update Course Error:', error);
    return res.status(500).json({ message: 'Server error updating course' });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await CourseModel.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.deleteOne();
    return res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete Course Error:', error);
    return res.status(500).json({ message: 'Server error deleting course' });
  }
};

export const getAllFreelancers = async (req, res) => {
  try {
    const freelancers = await FreelancerModel.find({})
      .populate('ownerId', 'uname email freelancerApprovalStatus')
      .sort({ createdAt: -1 });
    return res.status(200).json(freelancers.map(mapFreelancer));
  } catch (error) {
    console.error('Get All Freelancers Error:', error);
    return res.status(500).json({ message: 'Server error fetching freelancers' });
  }
};

export const createFreelancer = async (req, res) => {
  try {
    const {
      name,
      roleTitle,
      rating,
      reviews,
      hourlyRate,
      skills,
      category,
      location,
      about,
      completedJobs,
      verified,
      responseTime,
      languages,
      memberSince,
      publicVisibility,
    } = req.body;

    if (!name || !roleTitle || hourlyRate === undefined || !category) {
      return res.status(400).json({ message: 'Name, role title, hourly rate, and category are required' });
    }

    const freelancer = await FreelancerModel.create({
      sourceType: 'admin',
      publicVisibility: publicVisibility === 'private' ? 'private' : 'public',
      name,
      roleTitle,
      rating: Number(rating || 0),
      reviews: Number(reviews || 0),
      hourlyRate: Number(hourlyRate),
      skills: normalizeSkills(skills),
      category,
      location: location || '',
      about: about || '',
      completedJobs: Number(completedJobs || 0),
      verified: verified !== false,
      responseTime: responseTime || '~ 1 hour',
      languages: normalizeSkills(languages),
      memberSince: memberSince || '',
    });

    return res.status(201).json({ message: 'Freelancer created successfully', freelancer: mapFreelancer(freelancer) });
  } catch (error) {
    console.error('Create Freelancer Error:', error);
    return res.status(500).json({ message: 'Server error creating freelancer' });
  }
};

export const updateFreelancer = async (req, res) => {
  try {
    const freelancer = await FreelancerModel.findById(req.params.id).populate('ownerId', 'uname email freelancerApprovalStatus accountType');

    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    const stringFields = ['name', 'roleTitle', 'category', 'location', 'about', 'responseTime', 'memberSince'];
    stringFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        freelancer[field] = req.body[field];
      }
    });

    if (req.body.rating !== undefined) freelancer.rating = Number(req.body.rating);
    if (req.body.reviews !== undefined) freelancer.reviews = Number(req.body.reviews);
    if (req.body.hourlyRate !== undefined) freelancer.hourlyRate = Number(req.body.hourlyRate);
    if (req.body.completedJobs !== undefined) freelancer.completedJobs = Number(req.body.completedJobs);
    if (req.body.skills !== undefined) freelancer.skills = normalizeSkills(req.body.skills);
    if (req.body.languages !== undefined) freelancer.languages = normalizeSkills(req.body.languages);

    if (freelancer.ownerId) {
      const owner = freelancer.ownerId;
      const shouldBePublic = owner.accountType === 'freelancer' && owner.freelancerApprovalStatus === 'approved';
      freelancer.ownerEmail = owner.email;
      freelancer.publicVisibility = shouldBePublic ? 'public' : 'private';
      freelancer.verified = shouldBePublic;
    } else {
      if (req.body.verified !== undefined) freelancer.verified = Boolean(req.body.verified);
      if (req.body.publicVisibility !== undefined) {
        freelancer.publicVisibility = req.body.publicVisibility === 'private' ? 'private' : 'public';
      }
    }

    await freelancer.save();
    return res.status(200).json({ message: 'Freelancer updated successfully', freelancer: mapFreelancer(freelancer) });
  } catch (error) {
    console.error('Update Freelancer Error:', error);
    return res.status(500).json({ message: 'Server error updating freelancer' });
  }
};

export const deleteFreelancer = async (req, res) => {
  try {
    const freelancer = await FreelancerModel.findById(req.params.id);

    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    await freelancer.deleteOne();
    return res.status(200).json({ message: 'Freelancer deleted successfully' });
  } catch (error) {
    console.error('Delete Freelancer Error:', error);
    return res.status(500).json({ message: 'Server error deleting freelancer' });
  }
};

export const getReports = async (req, res) => {
  try {
    const now = new Date();
    const currentMonthRange = getMonthRange(now);

    const [
      monthlyUsers,
      monthlyCourses,
      monthlyFreelancers,
      monthlyApprovedFreelancers,
      totalUsers,
      totalCourses,
      totalFreelancers,
      totalPublicFreelancers,
      pendingFreelancerApprovals,
    ] = await Promise.all([
      UserModel.countDocuments({ createdAt: { $gte: currentMonthRange.start, $lt: currentMonthRange.end } }),
      CourseModel.countDocuments({ createdAt: { $gte: currentMonthRange.start, $lt: currentMonthRange.end } }),
      FreelancerModel.countDocuments({ createdAt: { $gte: currentMonthRange.start, $lt: currentMonthRange.end } }),
      UserModel.countDocuments({
        accountType: 'freelancer',
        freelancerApprovalStatus: 'approved',
        updatedAt: { $gte: currentMonthRange.start, $lt: currentMonthRange.end },
      }),
      UserModel.countDocuments(),
      CourseModel.countDocuments(),
      FreelancerModel.countDocuments(),
      FreelancerModel.countDocuments({ $or: [{ publicVisibility: 'public' }, { publicVisibility: { $exists: false } }] }),
      UserModel.countDocuments({ accountType: 'freelancer', freelancerApprovalStatus: 'pending' }),
    ]);

    const sixMonthReport = [];
    for (let offset = 5; offset >= 0; offset -= 1) {
      const referenceDate = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      const { start, end } = getMonthRange(referenceDate);
      const [users, courses, freelancers, approvals] = await Promise.all([
        UserModel.countDocuments({ createdAt: { $gte: start, $lt: end } }),
        CourseModel.countDocuments({ createdAt: { $gte: start, $lt: end } }),
        FreelancerModel.countDocuments({ createdAt: { $gte: start, $lt: end } }),
        UserModel.countDocuments({
          accountType: 'freelancer',
          freelancerApprovalStatus: 'approved',
          updatedAt: { $gte: start, $lt: end },
        }),
      ]);

      sixMonthReport.push({
        label: referenceDate.toLocaleString('en-US', { month: 'short', year: 'numeric' }),
        users,
        courses,
        freelancers,
        freelancerApprovals: approvals,
      });
    }

    return res.status(200).json({
      monthlyReport: {
        label: now.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
        newUsers: monthlyUsers,
        newCourses: monthlyCourses,
        newFreelancers: monthlyFreelancers,
        approvedFreelancersThisMonth: monthlyApprovedFreelancers,
        totalUsers,
        totalCourses,
        totalFreelancers,
        totalPublicFreelancers,
        pendingFreelancerApprovals,
      },
      sixMonthReport,
    });
  } catch (error) {
    console.error('Get Reports Error:', error);
    return res.status(500).json({ message: 'Server error generating reports' });
  }
};
