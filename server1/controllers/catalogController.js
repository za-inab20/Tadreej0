import CourseModel from '../models/CourseModel.js';
import FreelancerModel from '../models/FreelancerModel.js';

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

const getFreelancerApprovalStatus = (user) => {
  if (!user) return 'not_requested';
  if (user.accountType !== 'freelancer') return 'not_requested';
  return user.freelancerApprovalStatus || 'pending';
};

const buildMemberSince = () => new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' });

const buildFreelancerResponse = (freelancer) => {
  const item = freelancer.toObject ? freelancer.toObject() : { ...freelancer };

  return {
    ...item,
    ownerId: item.ownerId?._id || item.ownerId || null,
    ownerName: item.ownerId?.uname || item.ownerName || '',
    ownerEmail: item.ownerEmail || item.ownerId?.email || '',
    sourceType: item.sourceType || 'admin',
    publicVisibility: item.publicVisibility || 'public',
  };
};

const canShowPublicFreelancer = (freelancer) => {
  const visibility = freelancer.publicVisibility || 'public';
  const owner = freelancer.ownerId;

  if (owner) {
    return (
      visibility === 'public' &&
      owner.accountType === 'freelancer' &&
      owner.freelancerApprovalStatus === 'approved'
    );
  }

  return visibility === 'public';
};

export const getCourses = async (req, res) => {
  try {
    const courses = await CourseModel.find({ isPublished: true }).sort({ createdAt: -1 });
    return res.status(200).json(courses);
  } catch (error) {
    console.error('Get Courses Error:', error);
    return res.status(500).json({ message: 'Server error fetching courses' });
  }
};

export const getFreelancers = async (req, res) => {
  try {
    const freelancers = await FreelancerModel.find({})
      .populate('ownerId', 'uname email accountType freelancerApprovalStatus')
      .sort({ createdAt: -1 });

    const publicFreelancers = freelancers.filter(canShowPublicFreelancer);

    return res.status(200).json(publicFreelancers.map(buildFreelancerResponse));
  } catch (error) {
    console.error('Get Freelancers Error:', error);
    return res.status(500).json({ message: 'Server error fetching freelancers' });
  }
};

export const getFreelancerById = async (req, res) => {
  try {
    const freelancer = await FreelancerModel.findById(req.params.id).populate(
      'ownerId',
      'uname email accountType freelancerApprovalStatus'
    );

    if (!freelancer || !canShowPublicFreelancer(freelancer)) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    return res.status(200).json(buildFreelancerResponse(freelancer));
  } catch (error) {
    console.error('Get Freelancer By ID Error:', error);
    return res.status(500).json({ message: 'Server error fetching freelancer' });
  }
};

export const getMyFreelancers = async (req, res) => {
  try {
    if (req.authUser.accountType !== 'freelancer') {
      return res.status(403).json({ message: 'Only freelancer accounts can manage freelancer services' });
    }

    const items = await FreelancerModel.find({ ownerId: req.authUser._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      approvalStatus: getFreelancerApprovalStatus(req.authUser),
      items: items.map(buildFreelancerResponse),
    });
  } catch (error) {
    console.error('Get My Freelancers Error:', error);
    return res.status(500).json({ message: 'Server error fetching your freelancer services' });
  }
};

export const createMyFreelancer = async (req, res) => {
  try {
    if (req.authUser.accountType !== 'freelancer') {
      return res.status(403).json({ message: 'Only freelancer accounts can create freelancer services' });
    }

    const {
      name,
      roleTitle,
      hourlyRate,
      category,
      location,
      about,
      completedJobs,
      responseTime,
      skills,
      languages,
      memberSince,
    } = req.body;

    if (!roleTitle || hourlyRate === undefined || !category) {
      return res.status(400).json({ message: 'Role title, hourly rate, and category are required' });
    }

    const approvalStatus = getFreelancerApprovalStatus(req.authUser);

    const freelancer = await FreelancerModel.create({
      ownerId: req.authUser._id,
      ownerEmail: req.authUser.email,
      sourceType: 'user',
      publicVisibility: approvalStatus === 'approved' ? 'public' : 'private',
      name: name || req.authUser.uname,
      roleTitle,
      rating: 0,
      reviews: 0,
      hourlyRate: Number(hourlyRate),
      skills: normalizeSkills(skills),
      category,
      location: location || '',
      about: about || '',
      completedJobs: Number(completedJobs || 0),
      verified: approvalStatus === 'approved',
      responseTime: responseTime || '~ 1 hour',
      languages: normalizeSkills(languages).length ? normalizeSkills(languages) : ['English'],
      memberSince: memberSince || buildMemberSince(),
    });

    return res.status(201).json({
      message:
        approvalStatus === 'approved'
          ? 'Freelancer service created and published successfully'
          : 'Freelancer service created successfully and is visible only to you until admin approval',
      freelancer: buildFreelancerResponse(freelancer),
    });
  } catch (error) {
    console.error('Create My Freelancer Error:', error);
    return res.status(500).json({ message: 'Server error creating your freelancer service' });
  }
};

export const updateMyFreelancer = async (req, res) => {
  try {
    if (req.authUser.accountType !== 'freelancer') {
      return res.status(403).json({ message: 'Only freelancer accounts can update freelancer services' });
    }

    const freelancer = await FreelancerModel.findOne({ _id: req.params.id, ownerId: req.authUser._id });

    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer service not found' });
    }

    const stringFields = ['name', 'roleTitle', 'category', 'location', 'about', 'responseTime', 'memberSince'];
    stringFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        freelancer[field] = req.body[field];
      }
    });

    if (req.body.hourlyRate !== undefined) freelancer.hourlyRate = Number(req.body.hourlyRate);
    if (req.body.completedJobs !== undefined) freelancer.completedJobs = Number(req.body.completedJobs);
    if (req.body.skills !== undefined) freelancer.skills = normalizeSkills(req.body.skills);
    if (req.body.languages !== undefined) {
      const normalizedLanguages = normalizeSkills(req.body.languages);
      freelancer.languages = normalizedLanguages.length ? normalizedLanguages : ['English'];
    }

    const approvalStatus = getFreelancerApprovalStatus(req.authUser);
    freelancer.ownerEmail = req.authUser.email;
    freelancer.publicVisibility = approvalStatus === 'approved' ? 'public' : 'private';
    freelancer.verified = approvalStatus === 'approved';

    await freelancer.save();

    return res.status(200).json({
      message:
        approvalStatus === 'approved'
          ? 'Freelancer service updated successfully'
          : 'Freelancer service updated. It remains private until admin approval.',
      freelancer: buildFreelancerResponse(freelancer),
    });
  } catch (error) {
    console.error('Update My Freelancer Error:', error);
    return res.status(500).json({ message: 'Server error updating your freelancer service' });
  }
};

export const deleteMyFreelancer = async (req, res) => {
  try {
    if (req.authUser.accountType !== 'freelancer') {
      return res.status(403).json({ message: 'Only freelancer accounts can delete freelancer services' });
    }

    const freelancer = await FreelancerModel.findOne({ _id: req.params.id, ownerId: req.authUser._id });

    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer service not found' });
    }

    await freelancer.deleteOne();
    return res.status(200).json({ message: 'Freelancer service deleted successfully' });
  } catch (error) {
    console.error('Delete My Freelancer Error:', error);
    return res.status(500).json({ message: 'Server error deleting your freelancer service' });
  }
};
