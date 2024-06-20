import React, { useContext } from 'react';
import { Container } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, useLocation } from 'react-router-dom';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';
import NavBar from './components/NavBar';
import AdminNavBar from './pages/AdminNavbar';
import { AuthContext } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
import Home from './pages/Home';
import Categories from './pages/Categories';
import FingerSpelling from './pages/FingerSpelling';
import AdminDashboard from './pages/AdminDashboard';
import Timeline from './pages/Timeline';
import EditUser from './pages/EditUser';
import AdminPosts from './pages/AdminPosts';
import VideoCall from './pages/VideoCall';

function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const isAdminRoute = () => {
    return location.pathname.startsWith('/admin');
  };

  return (
    <ChatContextProvider user={user}>
      {isAdminRoute() ? <AdminNavBar /> : <NavBar />}
      <Container className="text-secondary">
        <Routes>
          <Route path="/" element={user ? <Home /> : <Login />} />
          <Route path="/register" element={user ? <Home /> : <Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={user ? <Home /> : <Login />} />
          <Route path="/chat" element={user ? <Chat /> : <Login />} />
          <Route path="/categories" element={user ? <Categories /> : <Login />} />
          <Route path="/fingerspelling" element={user ? <FingerSpelling /> : <Login />} />
          <Route path="/timeline" element={user ? <Timeline /> : <Login />} />
          <Route path="/edit-user" element={user ? <EditUser /> : <Login />} />
          <Route path="/video_call" component={VideoCall} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={user?.role === 'admin' ? <AdminLayout /> : <Login />}>
            <Route index element={<AdminDashboard />} />
            <Route path="posts" element={<AdminPosts />} />
          </Route>
        </Routes>
      </Container>
    </ChatContextProvider>
  );
}

// Layout component for Admin routes
const AdminLayout = () => (
  <>
    <Container className="text-secondary">
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="posts" element={<AdminPosts />} />
      </Routes>
    </Container>
  </>
);

export default App;
