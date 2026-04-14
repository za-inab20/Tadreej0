import CourseModel from '../models/CourseModel.js';
import FreelancerModel from '../models/FreelancerModel.js';

const defaultCourses = [
  {
    title: 'Complete React Developer Course 2025',
    instructor: 'John Doe',
    rating: 4.8,
    reviews: 1200,
    price: 49.99,
    duration: '40h',
    category: 'Development',
    level: 'Beginner',
    description: 'A complete hands-on React course covering components, routing, state, forms, and deployment.',
  },
  {
    title: 'Digital Marketing Masterclass',
    instructor: 'Sarah Smith',
    rating: 4.7,
    reviews: 850,
    price: 39.99,
    duration: '25h',
    category: 'Marketing',
    level: 'Intermediate',
    description: 'Learn growth channels, campaign planning, content strategy, and paid acquisition fundamentals.',
  },
  {
    title: 'UI/UX Design Fundamentals',
    instructor: 'Lisa Wang',
    rating: 4.9,
    reviews: 2000,
    price: 59.99,
    duration: '30h',
    category: 'Design',
    level: 'Beginner',
    description: 'Master design thinking, wireframing, prototyping, and user-centered product design.',
  },
  {
    title: 'Startup Business Planning 101',
    instructor: 'Michael Brown',
    rating: 4.6,
    reviews: 500,
    price: 29.99,
    duration: '15h',
    category: 'Business',
    level: 'Beginner',
    description: 'Build a business model, validate your idea, and structure a practical startup execution plan.',
  },
  {
    title: 'Advanced Node.js & Microservices',
    instructor: 'Ahmed Ali',
    rating: 4.8,
    reviews: 300,
    price: 69.99,
    duration: '50h',
    category: 'Development',
    level: 'Advanced',
    description: 'Design scalable backend systems with Node.js, microservices, and distributed architecture patterns.',
  },
  {
    title: 'Copywriting for Conversions',
    instructor: 'Emily Davis',
    rating: 4.7,
    reviews: 600,
    price: 34.99,
    duration: '10h',
    category: 'Writing',
    level: 'Intermediate',
    description: 'Write landing pages, ads, and emails that increase clicks, engagement, and conversions.',
  },
];

const defaultFreelancers = [
  {
    name: 'Ahmed Ali',
    roleTitle: 'Full Stack Developer',
    rating: 4.9,
    reviews: 120,
    hourlyRate: 45,
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'Redux', 'AWS'],
    category: 'Development',
    location: 'Cairo, Egypt',
    about: 'Full stack developer focused on scalable MERN applications, APIs, and startup MVP delivery.',
    completedJobs: 45,
    languages: ['English', 'Arabic'],
    memberSince: 'Jan 2023',
  },
  {
    name: 'Sarah Smith',
    roleTitle: 'UI/UX Designer',
    rating: 4.8,
    reviews: 85,
    hourlyRate: 55,
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Wireframing'],
    category: 'Design',
    location: 'London, UK',
    about: 'UI/UX designer specialized in intuitive user journeys, prototypes, and visual systems for startups.',
    completedJobs: 32,
    languages: ['English'],
    memberSince: 'Mar 2022',
  },
  {
    name: 'Mohamed Hassan',
    roleTitle: 'Digital Marketer',
    rating: 4.7,
    reviews: 60,
    hourlyRate: 35,
    skills: ['SEO', 'Google Ads', 'Content Strategy', 'Social Media', 'Analytics'],
    category: 'Marketing',
    location: 'Dubai, UAE',
    about: 'Digital marketer helping businesses improve traffic, lead generation, and performance campaigns.',
    completedJobs: 28,
    languages: ['English', 'Arabic'],
    memberSince: 'Jun 2023',
  },
  {
    name: 'Emily Davis',
    roleTitle: 'Content Writer',
    rating: 4.9,
    reviews: 200,
    hourlyRate: 30,
    skills: ['Copywriting', 'Blog Writing', 'Editing', 'SEO Writing', 'Creative Writing'],
    category: 'Writing',
    location: 'New York, USA',
    about: 'Content writer producing conversion-focused copy, SEO content, and editorial content for brands.',
    completedJobs: 150,
    languages: ['English'],
    memberSince: 'Nov 2021',
  },
  {
    name: 'John Doe',
    roleTitle: 'Mobile App Developer',
    rating: 4.6,
    reviews: 45,
    hourlyRate: 60,
    skills: ['Flutter', 'Dart', 'Firebase', 'iOS', 'Android'],
    category: 'Development',
    location: 'Toronto, Canada',
    about: 'Mobile app developer building fast cross-platform products with Flutter and Firebase.',
    completedJobs: 18,
    languages: ['English'],
    memberSince: 'Feb 2024',
  },
  {
    name: 'Lisa Wang',
    roleTitle: 'Graphic Designer',
    rating: 4.8,
    reviews: 95,
    hourlyRate: 40,
    skills: ['Photoshop', 'Illustrator', 'Branding', 'Logo Design', 'Print Design'],
    category: 'Design',
    location: 'Singapore',
    about: 'Graphic designer crafting branding systems, marketing assets, and polished visual communication.',
    completedJobs: 65,
    languages: ['English'],
    memberSince: 'Aug 2022',
  },
];

export const seedDefaultData = async () => {
  try {
    const courseCount = await CourseModel.countDocuments();
    if (courseCount === 0) {
      await CourseModel.insertMany(defaultCourses);
      console.log('✅ Default courses seeded');
    }

    const freelancerCount = await FreelancerModel.countDocuments();
    if (freelancerCount === 0) {
      await FreelancerModel.insertMany(defaultFreelancers);
      console.log('✅ Default freelancers seeded');
    }
  } catch (error) {
    console.error('Seed Default Data Error:', error.message);
  }
};
