const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reactionSchema = new mongoose.Schema({
  user: String,
  type: {
    type: String,
    enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'],
  },
});

const commentSchema = new mongoose.Schema({
  user: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  media: String, // URL to image/video
  reactions: [reactionSchema],
  comments: [commentSchema],
  sharedFrom: { type: Schema.Types.ObjectId, ref: 'Post' },
  isAdminPost: { type: Boolean, default: false }, // New field to indicate admin news
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
