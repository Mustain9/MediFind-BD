const express = require("express");

const router = express.Router();

const {
    getProfile,
    updateProfile,
    changePassword,
    getAllUsers
} = require("../controllers/userController");

const authMiddleware =
    require("../middleware/authMiddleware");


// ==========================================
// ADMIN - GET ALL USERS
// ==========================================

router.get(
    "/admin/all",
    authMiddleware,
    getAllUsers
);


// ==========================================
// USER PROFILE
// ==========================================

router.get(
    "/profile",
    authMiddleware,
    getProfile
);


// ==========================================
// UPDATE PROFILE
// ==========================================

router.put(
    "/profile",
    authMiddleware,
    updateProfile
);


// ==========================================
// CHANGE PASSWORD
// ==========================================

router.put(
    "/change-password",
    authMiddleware,
    changePassword
);


module.exports = router;