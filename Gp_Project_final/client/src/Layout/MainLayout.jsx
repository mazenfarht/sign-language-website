import React from 'react';
import ReactDOM from 'react-dom';
import '../../index';
import '../../index.css'
import NavBar from './NavBar';
import Home from './Home';

const App = () => (
  <>
    <NavBar />
    <Home />
  </>
);

ReactDOM.render(<App />, document.getElementById('root'));
