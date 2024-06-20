// routes/adminRoute.js
const express = require("express");
const router = express.Router();
const { requireAuth, requireAdmin } = require("../middlewares/authMiddleware");
const AdminDashboardController = require("../controllers/AdminDashboardController");

router.use(requireAuth); // All admin routes require authentication
router.use(requireAdmin); // All admin routes require admin role

router.get("/dashboard", AdminDashboardController.getDashboardData);

module.exports = router;
