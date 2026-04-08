import mongoose from 'mongoose';

const FreelancerSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    ownerEmail: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    sourceType: {
      type: String,
      enum: ['admin', 'user'],
      default: 'admin',
    },
    publicVisibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    roleTitle: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    hourlyRate: {
      type: Number,
      required: true,
      min: 0,
    },
    skills: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    about: {
      type: String,
      default: '',
      trim: true,
    },
    completedJobs: {
      type: Number,
      default: 0,
      min: 0,
    },
    verified: {
      type: Boolean,
      default: true,
    },
    responseTime: {
      type: String,
      default: '~ 1 hour',
      trim: true,
    },
    languages: {
      type: [String],
      default: ['English'],
    },
    memberSince: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

const FreelancerModel = mongoose.model('Freelancer', FreelancerSchema);

export default FreelancerModel;
