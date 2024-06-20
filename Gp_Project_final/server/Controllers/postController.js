const Post = require('../Models/postModel');
const multer = require('multer');
const path = require('path');

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const createPost = async (req, res) => {
  const { content, author } = req.body;
  let media = '';
  if (req.file) {
    media = `/uploads/${req.file.filename}`;
  }

  try {
    const newPost = new Post({
      content,
      author,
      media,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

const addReaction = async (req, res) => {
  const { postId } = req.params;
  const { user, type } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const existingReaction = post.reactions.find(r => r.user === user);
    if (existingReaction) {
      existingReaction.type = type;
    } else {
      post.reactions.push({ user, type });
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error('Error adding/updating reaction:', error);
    res.status(500).json({ error: 'Failed to add/update reaction' });
  }
};

const addComment = async (req, res) => {
  const { postId } = req.params;
  const { user, content } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.comments.push({ user, content });
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

const deletePost = async (req, res) => {
  const { postId } = req.params;
  const { author } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author === author) {
      await post.deleteOne();
      res.status(200).json({ success: true });
    } else {
      res.status(403).json({ error: 'You are not authorized to delete this post' });
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { user } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.user !== user) {
      return res.status(403).json({ error: 'You can only delete your own comments' });
    }

    // Use pull to remove the comment
    post.comments.pull(commentId);
    await post.save();
    res.status(200).json({ message: 'Comment deleted successfully', post });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};



const editPost = async (req, res) => {
  const { postId } = req.params;
  const { content, author } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author !== author) {
      return res.status(403).json({ error: 'You are not authorized to edit this post' });
    }

    post.content = content;
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error('Error editing post:', error);
    res.status(500).json({ error: 'Failed to edit post' });
  }
};

const sharePost = async (req, res) => {
  const { postId } = req.params;
  const { user } = req.body;

  try {
    const originalPost = await Post.findById(postId);
    if (!originalPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const sharedPost = new Post({
      content: originalPost.content,
      author: user,
      media: originalPost.media,
      sharedFrom: postId,
    });

    await sharedPost.save();
    res.status(201).json(sharedPost);
  } catch (error) {
    console.error('Error sharing post:', error);
    res.status(500).json({ error: 'Failed to share post' });
  }
};
const updateComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { user, content } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.user !== user) {
      return res.status(403).json({ error: 'You can only edit your own comments' });
    }

    comment.content = content;
    await post.save();
    res.status(200).json({ message: 'Comment updated successfully', post });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

const createAdminPost = async (req, res) => {
  const { content, author } = req.body;
  let media = '';
  if (req.file) {
    media = `/uploads/${req.file.filename}`;
  }

  try {
    const newPost = new Post({
      content,
      author,
      media,
      isAdminPost: true, // Mark this post as admin news
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create admin post' });
  }
};

const deleteAnyPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await post.deleteOne();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

module.exports = {
  createPost,
  getPosts,
  addReaction,
  addComment,
  deletePost,
  deleteComment,
  editPost,
  sharePost,
  upload,
  updateComment,
  createAdminPost, // Export the new function
  deleteAnyPost    // Export the new function
};
