import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './AdminDashboard.css'; // Import the CSS file

const AdminDashboard = () => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [letter, setLetter] = useState('');
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchVideos = async () => {
      const response = await axios.get('http://localhost:5000/api/videos');
      setVideos(response.data);
    };
    fetchVideos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('http://localhost:5000/api/videos', { title, url, letter });
    setVideos([...videos, response.data]);
    setTitle('');
    setUrl('');
    setLetter('');
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/videos/${id}`);
    setVideos(videos.filter((video) => video._id !== id));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>URL:</label>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <div>
          <label>Letter:</label>
          <input type="text" value={letter} onChange={(e) => setLetter(e.target.value.toUpperCase())} />
        </div>
        <button type="submit">Add Video</button>
      </form>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search videos by title"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <h2>Existing Videos</h2>
      <ul>
        {filteredVideos.map((video) => (
          <li key={video._id}>
            {video.title} ({video.letter}) - {video.url}
            <button onClick={() => handleDelete(video._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;