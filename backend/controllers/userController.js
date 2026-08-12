const db = require("../config/db");
const bcrypt = require("bcrypt");

// ==========================================
// GET LOGGED-IN USER PROFILE
// ==========================================
const getProfile = (req, res) => {

    const userId = req.user.id;

    db.query(
        "SELECT id, full_name, email, phone, role FROM users WHERE id = ?",
        [userId],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            res.json({
                success: true,
                user: result[0]
            });
        }
    );
};


// ==========================================
// UPDATE PROFILE
// ==========================================
const updateProfile = (req, res) => {

    const userId = req.user.id;

    const {
        full_name,
        phone
    } = req.body;

    db.query(
        "UPDATE users SET full_name=?, phone=? WHERE id=?",
        [
            full_name,
            phone,
            userId
        ],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Profile updated successfully"
            });
        }
    );
};


// ==========================================
// CHANGE PASSWORD
// ==========================================
const changePassword = (req, res) => {

    const userId = req.user.id;

    const {
        currentPassword,
        newPassword
    } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "Current password and new password are required"
        });
    }

    db.query(
        "SELECT password FROM users WHERE id=?",
        [userId],
        async (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            try {

                const match = await bcrypt.compare(
                    currentPassword,
                    result[0].password
                );

                if (!match) {
                    return res.status(400).json({
                        success: false,
                        message: "Current password is incorrect"
                    });
                }

                const hashedPassword =
                    await bcrypt.hash(newPassword, 10);

                db.query(
                    "UPDATE users SET password=? WHERE id=?",
                    [
                        hashedPassword,
                        userId
                    ],
                    (err) => {

                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: err.message
                            });
                        }

                        res.json({
                            success: true,
                            message: "Password changed successfully"
                        });
                    }
                );

            } catch (error) {

                console.error(
                    "Change password error:",
                    error
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to change password"
                });
            }
        }
    );
};


// ==========================================
// ADMIN - GET ALL USERS
// ==========================================
const getAllUsers = (req, res) => {

    console.log("Admin User Role:", req.user.role);

    const userRole = String(req.user.role || "")
        .trim()
        .toLowerCase();

    // ==========================================
    // ADMIN CHECK
    // ==========================================
    if (
        userRole !== "admin" &&
        userRole !== "administrator"
    ) {
        return res.status(403).json({
            success: false,
            message: "Admin access required",
            role: req.user.role
        });
    }

    // ==========================================
    // GET USERS
    // ==========================================
    const sql = `
        SELECT
            id,
            full_name,
            email,
            phone,
            role
        FROM users
        ORDER BY id DESC
    `;

    db.query(
        sql,
        (err, result) => {

            if (err) {

                console.error(
                    "Get All Users Error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to load users",
                    error: err.message
                });
            }

            return res.json({
                success: true,
                users: result
            });
        }
    );
};


// ==========================================
// EXPORT ALL CONTROLLERS
// ==========================================
module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    getAllUsers
};