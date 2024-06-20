import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // This includes your CSS
import NavBar from './components/NavBar';
import Home from './components/Home';

const container = document.getElementById('root');
const root = createRoot(container);

const App = () => (
  <>
    <NavBar />
    <Home />
  </>
);

root.render(<App />);
