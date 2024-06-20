const express = require('express');
const Post = require('../Models/postModel');
const { verifyAdmin } = require('../middleware/auth'); // Assuming you have a middleware to verify admin
const router = express.Router();
const {
  createPost,
  getPosts,
  addReaction,
  addComment,
  deletePost,
  editPost,
  sharePost,
  upload,
  deleteComment,
  updateComment,
  createAdminPost,
  deleteAnyPost
} = require('../Controllers/postController');

router.post('/create', upload.single('media'), createPost);
router.get('/', getPosts);
router.post('/:postId/reaction', addReaction);
router.post('/:postId/comment', addComment);
router.delete('/:postId', deletePost);
router.put('/:postId', editPost); // New route for editing a post
router.post('/:postId/share', sharePost); // New route for sharing a post
router.delete('/:postId/comment/:commentId', deleteComment);
router.put('/:postId/comment/:commentId', updateComment); // Add the new route
router.post('/admin/create', upload.single('media'), createAdminPost);
router.delete('/admin/:postId', deleteAnyPost);
router.delete('/admin/:postId', verifyAdmin, async (req, res) => {
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
});

module.exports = router;
