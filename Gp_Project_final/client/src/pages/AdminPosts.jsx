import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './AdminPosts.css';

function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ content: '', media: null });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchAdminPosts();
  }, []);

  const fetchAdminPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleAddPost = async () => {
    if (!newPost.content.trim()) {
      alert('Post content cannot be empty.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('content', newPost.content);
      formData.append('author', user.name);
      if (newPost.media) {
        formData.append('media', newPost.media);
      }

      const response = await fetch('http://localhost:5000/api/posts/admin/create', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }
      fetchAdminPosts();
      setNewPost({ content: '', media: null });
    } catch (error) {
      console.error('Error creating post:', error.message);
    }
  };

  const handleMediaChange = (e) => {
    setNewPost({ ...newPost, media: e.target.files[0] });
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/admin/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete post');
      }
      fetchAdminPosts();
    } catch (error) {
      console.error('Error deleting post:', error.message);
    }
  };

  return (
    <div className="admin-posts-container">
      <div className="new-post-form">
        <div className="new-post-header">
          <span className="user-prompt">Post news, {user.name}</span>
        </div>
        <textarea
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          placeholder="Write your post here..."
        />
        <input
          type="file"
          onChange={handleMediaChange}
          accept="image/*"
        />
        <button onClick={handleAddPost}>Post</button>
      </div>
      <div>
        {posts.map((post) => (
          <div key={post._id} className="post">
            <div className="post-header">
              <div className="post-info">
                <span className="post-author">{post.author}</span>
                <span className="post-date">{new Date(post.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <p>{post.content}</p>
            {post.media && <img src={`http://localhost:5000${post.media}`} alt="Media" />}
            <button className="delete-button" onClick={() => handleDeletePost(post._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPosts;
