const db = require("../config/db");
const bcrypt = require("bcrypt");

// Get logged-in user profile
const getProfile = (req, res) => {
    const userId = req.user.id;

    db.query(
        "SELECT id, full_name, email, phone, role FROM users WHERE id = ?",
        [userId],
        (err, result) => {
            if (err) return res.status(500).json(err);

            if (result.length === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            res.json(result[0]);
        }
    );
};

// Update profile
const updateProfile = (req, res) => {
    const userId = req.user.id;

    const { full_name, phone } = req.body;

    db.query(
        "UPDATE users SET full_name=?, phone=? WHERE id=?",
        [full_name, phone, userId],
        (err) => {
            if (err) return res.status(500).json(err);

            res.json({
                message: "Profile updated successfully"
            });
        }
    );
};

// Change password
const changePassword = (req, res) => {

    const userId = req.user.id;

    const { currentPassword, newPassword } = req.body;

    db.query(
        "SELECT password FROM users WHERE id=?",
        [userId],
        async (err, result) => {

            if (err) return res.status(500).json(err);

            const match = await bcrypt.compare(
                currentPassword,
                result[0].password
            );

            if (!match) {
                return res.status(400).json({
                    message: "Current password is incorrect"
                });
            }

            const hashedPassword =
                await bcrypt.hash(newPassword, 10);

            db.query(
                "UPDATE users SET password=? WHERE id=?",
                [hashedPassword, userId],
                (err) => {

                    if (err)
                        return res.status(500).json(err);

                    res.json({
                        message:
                            "Password changed successfully"
                    });

                }
            );

        }
    );
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword
};