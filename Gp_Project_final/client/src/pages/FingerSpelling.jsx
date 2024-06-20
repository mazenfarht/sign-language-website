import React, { useState } from 'react';
import './Finger.css';

const videos = [
  { letter: 'A', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-591-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-591-3.jpg' },
  { letter: 'B', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-592-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-592-3.jpg' },
  { letter: 'C', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-593-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-593-3.jpg' },
  { letter: 'D', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-594-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-594-3.jpg' },
  { letter: 'E', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-595-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-595-3.jpg' },
  { letter: 'F', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-596-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-596-3.jpg' },
  { letter: 'G', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-597-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-597-3.jpg' },
  { letter: 'H', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-598-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-598-3.jpg' },
  { letter: 'I', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-599-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-599-3.jpg' },
  { letter: 'J', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-600-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-600-3.jpg' },
  { letter: 'K', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-601-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-601-3.jpg' },
  { letter: 'L', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-602-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-602-3.jpg' },
  { letter: 'M', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-603-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-603-3.jpg' },
  { letter: 'N', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-604-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-604-3.jpg' },
  { letter: 'O', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-605-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-605-3.jpg' },
  { letter: 'P', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-606-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-606-3.jpg' },
  { letter: 'Q', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-607-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-607-3.jpg' },
  { letter: 'R', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-608-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-608-3.jpg' },
  { letter: 'S', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-609-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-609-3.jpg' },
  { letter: 'T', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-610-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-610-3.jpg' },
  { letter: 'U', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-611-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-611-3.jpg' },
  { letter: 'V', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-612-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-612-3.jpg' },
  { letter: 'W', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-613-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-613-3.jpg' },
  { letter: 'X', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-614-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-614-3.jpg' },
  { letter: 'Y', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-615-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-615-3.jpg' },
  { letter: 'Z', link: 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-616-1.mp4', image: 'https://media.spreadthesign.com/image/500/alphabet-letter-616-3.jpg' },
];

export default function FingerSpelling() {
  const [selectedLetter, setSelectedLetter] = useState('A'); // Default to 'A'

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
  };

  return (
    <div id="wrap">
      <div className="container">
        <h1>ASL Hand Alphabet</h1>
        <div id="alphabet-letters" className="well">
          <div className="row">
            <div className="col-sm-2">
              <h3>Letters</h3>
              <ul className="alphabet-letter-list">
                {videos.map((video) => (
                  <li key={video.letter} className={`letter-item ${selectedLetter === video.letter ? 'active' : ''}`}>
                    <button className="letter-button" onClick={() => handleLetterClick(video.letter)}>{video.letter}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div id="alphabet-letter" className="col-sm-10">
              {selectedLetter && (
                <>
                  <h3>{selectedLetter}</h3>
                  <div className="row">
                    <div className="col-md-6 alphabet-letter-video">
                      <video src={videos.find((v) => v.letter === selectedLetter).link} width="320" height="240" muted loop controls></video>
                    </div>
                    <div className="col-md-6 alphabet-letter-image">
                      <img src={videos.find((v) => v.letter === selectedLetter).image} alt={`ASL letter ${selectedLetter}`} />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <nav>
                      <ul className="pager">
                        <li className="next">
                          <button
                            onClick={() => handleLetterClick(videos[(videos.findIndex(v => v.letter === selectedLetter) + 1) % videos.length].letter)}
                            className="btn btn-default"
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
