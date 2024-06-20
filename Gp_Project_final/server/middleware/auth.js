// middleware/auth.js

const verifyAdmin = (req, res, next) => {
    const user = req.user; // Assuming user info is attached to the request
  
    if (user && user.role === 'admin') {
      next(); // User is an admin, proceed to the next middleware/route handler
    } else {
      res.status(403).json({ error: 'Access denied' });
    }
  };
  
  module.exports = { verifyAdmin };
  