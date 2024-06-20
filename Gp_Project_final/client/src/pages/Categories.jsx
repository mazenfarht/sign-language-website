import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Categories.css';

const VideoDisplay = ({ videos }) => {
  return (
    <div className="video-display">
      <div className="video-container">
        {videos.map((video, index) => (
          <div className="video-item" key={index}>
            <h3>{video.title}</h3>
            <iframe
              title={`Video ${index + 1}`}
              src={video.url}
              frameBorder="10"
              allowFullScreen
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
};

const VideoPage = () => {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [videos, setVideos] = useState([]);

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
  };

  useEffect(() => {
    if (selectedLetter) {
      const fetchVideos = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/videos/${selectedLetter}`);
          setVideos(response.data);
        } catch (error) {
          console.error('Error fetching videos:', error);
        }
      };

      fetchVideos();
    }
  }, [selectedLetter]);

  const renderLetterButtons = () => {
    const letters = Array.from(Array(26), (_, i) => String.fromCharCode(65 + i));
    return letters.map((letter, index) => (
      <button key={index} onClick={() => handleLetterClick(letter)}>
        {letter}
      </button>
    ));
  };

  const renderSentenceButton = () => {
    return (
      <button onClick={() => handleLetterClick('SENTENCES')}>
        Sentences
      </button>
    );
  };

  return (
    <div>
      <div className="navbar">
        {renderLetterButtons()}
        {renderSentenceButton()}
      </div>
      <div className="video-container">
        {selectedLetter && (
          <div>
            <h2>Videos for {selectedLetter === 'SENTENCES' ? 'sentences' : `letter ${selectedLetter}`}</h2>
            <VideoDisplay videos={videos} />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPage;
