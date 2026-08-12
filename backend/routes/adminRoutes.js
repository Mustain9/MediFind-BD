const express = require("express");

const router = express.Router();

const {
    getDashboard
} = require("../controllers/adminController");

const verifyToken = require("../middleware/authMiddleware");

// ==========================================
// ADMIN DASHBOARD
// ==========================================

router.get(
    "/dashboard",
    verifyToken,
    getDashboard
);

module.exports = router;