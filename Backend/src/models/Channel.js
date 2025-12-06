import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  channelName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  channelBanner: {
    type: String,
    default: ''
  },
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
 }, { timestamps: true });


// Add a text index for search functionality
channelSchema.index({ channelName: 'text', description: 'text' });

export default mongoose.model('Channel', channelSchema);
