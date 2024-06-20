import { useContext } from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import defaultLogo from '../imgs/Untitled.png';
import Notification from "./chat/Notification";

const NavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <Navbar bg="dark" className="mb-4" style={{ height: "3.65rem" }}>
      <Container>
        <h2 style={{ fontSize: "1.25rem", marginTop: "18px" }}>
          <Link to="/" className="link-light text-decoration-none">
            Sign Language Translator
          </Link>
        </h2>
        <Nav>
          <Stack direction="horizontal" gap={3}>
            {user && (
              <>
                <Notification />
                <Nav.Link onClick={() => document.getElementById('ai-section').scrollIntoView({ behavior: 'smooth' })} className="nav-link cursor-pointer text-white">AI Technology</Nav.Link>
                <Nav.Link onClick={() => document.getElementById('translation-section').scrollIntoView({ behavior: 'smooth' })} className="nav-link cursor-pointer text-white">Translation</Nav.Link>
                <Nav.Link as={Link} to="/categories" className="text-white nav-link">Categories</Nav.Link>
                <Nav.Link as={Link} to="/FingerSpelling" className="text-white nav-link">Finger Spelling</Nav.Link>
                <Nav.Link as={Link} to="/timeline" className="text-white nav-link">Post</Nav.Link>
                <Nav.Link 
                  onClick={() => logoutUser()}
                  as={Link} 
                  to="/Login" 
                  className="link-light text-decoration-none">
                  Logout
                </Nav.Link>
              </>
            )}

            {!user && (
              <>
                <Nav.Link as={Link} to="/Login" className="link-light text-decoration-none">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="link-light text-decoration-none">
                  Register
                </Nav.Link>
              </>
            )}
          </Stack>
        </Nav>
        {user && (
          <Link to="/edit-user">
            <div style={{ display: "inline-block" }}>
              <img src={defaultLogo} alt="User Logo" style={{ height: "2rem" }} />
              <span className="text-warning">{user?.name}</span>
            </div>
          </Link>
        )}
      </Container>
    </Navbar>
  );
};

export default NavBar;
