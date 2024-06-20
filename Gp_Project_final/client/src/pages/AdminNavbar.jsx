import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminNavBar = () => {
  const navigate = useNavigate();
  const { logoutUser } = useContext(AuthContext);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handlePostsClick = () => {
    navigate('/admin/posts');
  };

  return (
    <Navbar bg="dark" className="mb-4" style={{ height: "3.65rem" }}>
      <Container>
        <Navbar.Brand>
          <h2>
            <Link to="/admin" className="link-light text-decoration-none">
              Sign Language Translator
            </Link>
          </h2>
        </Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link onClick={handlePostsClick} className="text-white">Posts</Nav.Link>
        </Nav>
        <Nav className="ml-auto">
          <Nav.Link onClick={handleLogout} className="text-white">Logout</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AdminNavBar;
