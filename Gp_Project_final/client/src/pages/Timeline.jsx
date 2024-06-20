import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faHeart, faLaugh, faSurprise, faSadTear, faAngry, faComment, faShare, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './Timeline.css';
import defaultLogo from '../imgs/Untitled.png';

function Timeline() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ content: '', media: null });
  const [showReactions, setShowReactions] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});
  const [reactionOptionsVisible, setReactionOptionsVisible] = useState(null);
  const [userReactions, setUserReactions] = useState({});
  const [showComments, setShowComments] = useState({});
  const [reactionsVisible, setReactionsVisible] = useState({});
  const [editingPost, setEditingPost] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
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

      const response = await fetch('http://localhost:5000/api/posts/create', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }
      fetchPosts();
      setNewPost({ content: '', media: null });
    } catch (error) {
      console.error('Error creating post:', error.message);
    }
  };

  const handleMediaChange = (e) => {
    setNewPost({ ...newPost, media: e.target.files[0] });
  };

  const handleReaction = async (postId, reactionType) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/reaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: user.name, type: reactionType }),
      });
      if (!response.ok) {
        throw new Error('Failed to add/update reaction');
      }
      setUserReactions((prev) => ({
        ...prev,
        [postId]: reactionType,
      }));
      fetchPosts();
      setReactionOptionsVisible(null);
    } catch (error) {
      console.error('Error adding/updating reaction:', error);
    }
  };

  const handleAddComment = async (postId, commentContent) => {
    if (!commentContent.trim()) {
      alert('Comment content cannot be empty.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: user.name, content: commentContent }),
      });
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      fetchPosts();
      setShowCommentInput((prev) => ({
        ...prev,
        [postId]: false,
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ author: user.name }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete post');
      }
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error.message);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/comment/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: user.name }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete comment');
      }
      fetchPosts();
    } catch (error) {
      console.error('Error deleting comment:', error.message);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
  };

  const handleUpdatePost = async () => {
    if (!editingPost.content.trim()) {
      alert('Post content cannot be empty.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/posts/${editingPost._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editingPost.content, author: user.name }),
      });
      if (!response.ok) {
        throw new Error('Failed to update post');
      }
      fetchPosts();
      setEditingPost(null);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleEditComment = (postId, comment) => {
    setEditingComment({ postId, ...comment });
  };

  const handleUpdateComment = async () => {
    if (!editingComment.content.trim()) {
      alert('Comment content cannot be empty.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/posts/${editingComment.postId}/comment/${editingComment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editingComment.content, user: user.name }),
      });
      if (!response.ok) {
        throw new Error('Failed to update comment');
      }
      fetchPosts();
      setEditingComment(null);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const toggleReactions = (postId) => {
    setShowReactions((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const toggleCommentInput = (postId) => {
    setShowCommentInput((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const showReactionOptions = (postId) => {
    setReactionOptionsVisible(postId);
  };

  const hideReactionOptions = () => {
    setReactionOptionsVisible(null);
  };

  const toggleReactionsVisibility = (postId) => {
    setReactionsVisible((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleShare = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: user.name }),
      });
      if (!response.ok) {
        throw new Error('Failed to share post');
      }
      fetchPosts();
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const getPostDate = (createdAt) => {
    const postDate = new Date(createdAt);
    const today = new Date();

    if (
      postDate.getDate() === today.getDate() &&
      postDate.getMonth() === today.getMonth() &&
      postDate.getFullYear() === today.getFullYear()
    ) {
      return 'Today';
    } else {
      return postDate.toLocaleString();
    }
  };

  return (
    <div className="timeline-container">
      <div className="new-post-form">
        <div className="new-post-header">
          <img src={defaultLogo} alt="User logo" className="user-logo" />
          <span className="user-prompt">What's on your mind, {user.name}?</span>
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
              <img src={defaultLogo} alt="User logo" />
              <div className="post-info">
                <span className="post-author">{post.author}</span>
                <span className="post-date">{getPostDate(post.createdAt)}</span>
              </div>
            </div>

            {editingPost && editingPost._id === post._id ? (
              <div>
                <textarea
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                />
                <button onClick={handleUpdatePost}>Update</button>
                <button onClick={() => setEditingPost(null)}>Cancel</button>
              </div>
            ) : (
              <p>{post.content}</p>
            )}
            {post.media && <img src={`http://localhost:5000${post.media}`} alt="Media" />}
            <div className="post-actions">
              <div
                className="like-button"
                onMouseEnter={() => showReactionOptions(post._id)}
                onMouseLeave={hideReactionOptions}
              >
                <button
                  onClick={() => handleReaction(post._id, userReactions[post._id] || 'like')}
                >
                  <FontAwesomeIcon icon={faThumbsUp} /> {userReactions[post._id] ? userReactions[post._id] : 'Like'} ({post.reactions.filter((r) => r.type === (userReactions[post._id] || 'like')).length})
                </button>
                {reactionOptionsVisible === post._id && (
                  <div className="reaction-options">
                    <button onClick={() => handleReaction(post._id, 'like')}>
                      <FontAwesomeIcon icon={faThumbsUp} /> Like
                    </button>
                    <button onClick={() => handleReaction(post._id, 'love')}>
                      <FontAwesomeIcon icon={faHeart} /> Love
                    </button>
                    <button onClick={() => handleReaction(post._id, 'haha')}>
                      <FontAwesomeIcon icon={faLaugh} /> Haha
                    </button>
                    <button onClick={() => handleReaction(post._id, 'wow')}>
                      <FontAwesomeIcon icon={faSurprise} /> Wow
                    </button>
                    <button onClick={() => handleReaction(post._id, 'sad')}>
                      <FontAwesomeIcon icon={faSadTear} /> Sad
                    </button>
                    <button onClick={() => handleReaction(post._id, 'angry')}>
                      <FontAwesomeIcon icon={faAngry} /> Angry
                    </button>
                  </div>
                )}
              </div>
              <button onClick={() => toggleComments(post._id)}>
                <FontAwesomeIcon icon={faComment} /> {showComments[post._id] ? 'Hide Comments' : 'Comments'} ({post.comments.length})
              </button>
              <button onClick={() => toggleReactionsVisibility(post._id)}>
                {reactionsVisible[post._id] ? 'Hide Reactions' : 'Show Reactions'} ({post.reactions.length})
              </button>
              <button onClick={() => handleShare(post._id)}><FontAwesomeIcon icon={faShare} /> Share</button>
              {post.author === user.name && (
                <button onClick={() => handleEditPost(post)}><FontAwesomeIcon icon={faEdit} /> Edit</button>
              )}
            </div>
            {reactionsVisible[post._id] && (
              <div className="reactions">
                {post.reactions.map((reaction, index) => (
                  <div key={index} className="reaction">
                    <p><strong>{reaction.user}:</strong> {reaction.type}</p>
                  </div>
                ))}
              </div>
            )}
            {showComments[post._id] && (
              <div className="comments">
                {post.comments.map((comment, index) => (
                  <div key={index} className="comment">
                    {editingComment && editingComment._id === comment._id ? (
                      <div>
                        <textarea
                          value={editingComment.content}
                          onChange={(e) => setEditingComment({ ...editingComment, content: e.target.value })}
                        />
                        <button className="update-button" onClick={handleUpdateComment}>Update</button>
                        <button className="cancel-button" onClick={() => setEditingComment(null)}>Cancel</button>
                      </div>
                    ) : (
                      <p><strong>{comment.user}:</strong> {comment.content}</p>
                    )}
                    <p className="timestamp">{new Date(comment.createdAt).toLocaleString()}</p>
                    {comment.user === user.name && (
                      <div>
                        <button className="delete-button" onClick={() => handleDeleteComment(post._id, comment._id)}><FontAwesomeIcon icon={faTrash} /> Delete</button>
                        <button className="edit-button" onClick={() => handleEditComment(post._id, comment)}><FontAwesomeIcon icon={faEdit} /> Edit</button>
                      </div>
                    )}
                  </div>
                ))}
                <button className="add-comment-button" onClick={() => toggleCommentInput(post._id)}>
                  {showCommentInput[post._id] ? 'Hide Comment' : 'Add Comment'}
                </button>
                {showCommentInput[post._id] && (
                  <textarea
                    placeholder="Write a comment..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment(post._id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                )}
              </div>
            )}
            {post.author === user.name && (
              <button className="delete-button" onClick={() => handleDeletePost(post._id)}><FontAwesomeIcon icon={faTrash} /> Delete</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Timeline;
