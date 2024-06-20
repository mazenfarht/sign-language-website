// src/components/VideoCall.jsx
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const VideoCall = () => {
    const videoRef = useRef(null);
    const [prediction, setPrediction] = useState('');

    useEffect(() => {
        const startVideo = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
        };

        startVideo();
    }, []);

    const sendVideoFrame = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            formData.append('video', blob, 'frame.jpg');
            const response = await axios.post('http://localhost:5000/video_feed', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setPrediction(response.data.prediction);
        });
    };

    useEffect(() => {
        const interval = setInterval(sendVideoFrame, 1000); // Adjust the interval as needed
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <video ref={videoRef} autoPlay />
            <p>Prediction: {prediction}</p>
        </div>
    );
};

export default VideoCall;
