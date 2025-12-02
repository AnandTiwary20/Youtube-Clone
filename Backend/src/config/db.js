require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/youtube-clone';
const PORT = process.env.PORT || 5000;

module.exports = {
  MONGODB_URI,
  PORT
};
