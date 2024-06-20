// src/components/Home.js
import React from 'react';
import 'animate.css';
import '../index.css';
import liveChatImg from '../imgs/live-chat.png';
import videoCallImg from '../imgs/video-call.png';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="container mx-auto my-10">
      <h1 className="text-white text-4xl font-semibold text-center mb-8 animate__animated animate__bounceIn">
        Welcome to Our Social Media App!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div id="video-call-section" className="section flex flex-col items-center bg-white rounded-lg shadow-md animate__animated animate__fadeInLeft">
          <h2 className="text-2xl font-semibold mb-4">Start a Video </h2>
          <img src={videoCallImg} alt="Video Call" className="half-width-img animate__animated animate__fadeInDown" />
          <p className="text-gray-700 text-center mb-4 animate__animated animate__fadeInUp">
          Real-time sign language translation uses advanced AI technology to interpret and convert sign language 
          into written text instantly.
          </p>
          <div className="centered-btn">
          <a href="http://127.0.0.1:5001/video_call" className="btn btn-success btn-lg">Start Video</a>
          </div>
        </div>

        <div id="chat-section" className="section flex flex-col items-center bg-white rounded-lg shadow-md animate__animated animate__fadeInRight">
          <h2 className="text-2xl font-semibold mb-4">Open Chat</h2>
          <img src={liveChatImg} alt="Live Chat" className="half-width-img animate__animated animate__fadeInDown" />
          <p className="text-gray-700 text-center mb-4 animate__animated animate__fadeInUp">
            Stay connected with your friends and share messages instantly.
          </p>
          <div className="centered-btn">
          <Link to="/chat" className="btn btn-green animate__animated animate__fadeIn">Open Chat</Link>
          </div>
        </div>
      </div>

      <section id="ai-section" className="bg-gray-100 py-12 rounded-section">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <img src="https://bicontent.businessinsurance.com/97c14ec5-699b-482a-9604-0f4785bb9e35.jpg" alt="AI Technology" className="half-size-img rounded-lg shadow-md animate__animated animate__fadeInLeft" />
          </div>
          <div className="md:w-1/2 md:ml-6">
            <h2 className="text-3xl font-semibold mb-4 animate__animated animate__fadeIn">AI Technology</h2>
            <p className="text-lg text-gray-700 animate__animated animate__fadeIn">Our social media platform leverages advanced AI technology to enhance user experience. From personalized content recommendations to intelligent sentiment analysis, our AI algorithms are constantly learning and adapting to provide you with the best possible experience.</p>
            <p className="text-lg text-gray-700 animate__animated animate__fadeIn">With our AI-powered features, you can discover relevant content tailored to your interests, engage with like-minded individuals, and stay informed about the latest trends and topics in your social network.</p>
          </div>
        </div>
      </section>

      <section id="translation-section" className="bg-gray-100 py-12 rounded-section">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <img src="https://miro.medium.com/v2/resize:fit:1330/0*tStVWACzIp_Jf00_" alt="Sign Language Translation" className="half-size-img rounded-lg shadow-md animate__animated animate__fadeInRight" />
            </div>
            <div className="md:w-1/2 md:ml-6">
              <h2 className="text-3xl font-semibold mb-4 animate__animated animate__fadeIn">Sign Language Translation</h2>
              <p className="text-lg text-gray-700 animate__animated animate__fadeIn">Break language barriers with our built-in sign language translation feature. Our platform utilizes cutting-edge technology to translate sign language into text and vice versa, making communication accessible to everyone, regardless of their hearing abilities.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 py-2 text-center text-white rounded-section">
        <p>&copy; 2024 Sign Language. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default Home;
