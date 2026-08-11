const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/db");

// ==========================================
// LOGIN
// ==========================================

exports.login = (req, res) => {

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, result) => {

            if (err) {
                console.error("Login database error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            // User not found
            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            const user = result[0];

            try {

                // Compare password
                const match = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!match) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid password"
                    });
                }

                // Create JWT
                const token = jwt.sign(
                    {
                        id: user.id,
                        email: user.email,
                        role: user.role
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "7d"
                    }
                );

                // Send response
                return res.json({
                    success: true,
                    message: "Login Successful",

                    token,

                    user: {
                        id: user.id,
                        full_name: user.full_name,
                        email: user.email,
                        phone: user.phone,
                        role: user.role
                    }
                });

            } catch (error) {

                console.error("Password/JWT error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Login failed"
                });
            }
        }
    );
};


// ==========================================
// REGISTER
// ==========================================

exports.register = async (req, res) => {

    const {
        full_name,
        email,
        phone,
        password,
        role
    } = req.body;

    console.log("Registration request:", req.body);

    // ==========================================
    // VALIDATION
    // ==========================================

    if (
        !full_name ||
        !email ||
        !password
    ) {
        return res.status(400).json({
            success: false,
            message: "Full name, email and password are required"
        });
    }

    // ==========================================
    // ALLOWED ROLES
    // ==========================================

    const selectedRole = role || "customer";

    if (
        selectedRole !== "customer" &&
        selectedRole !== "pharmacy"
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid registration role"
        });
    }

    try {

        // ==========================================
        // CHECK EMAIL
        // ==========================================

        db.query(
            "SELECT id FROM users WHERE email = ?",
            [email],
            async (err, result) => {

                if (err) {

                    console.error(
                        "Registration database error:",
                        err
                    );

                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });
                }

                if (result.length > 0) {

                    return res.status(400).json({
                        success: false,
                        message: "Email already exists"
                    });
                }

                // ==========================================
                // HASH PASSWORD
                // ==========================================

                const hashedPassword = await bcrypt.hash(
                    password,
                    10
                );

                // ==========================================
                // INSERT USER
                // ==========================================

                db.query(
                    `
                    INSERT INTO users
                    (
                        full_name,
                        email,
                        phone,
                        password,
                        role
                    )
                    VALUES (?, ?, ?, ?, ?)
                    `,
                    [
                        full_name,
                        email,
                        phone || null,
                        hashedPassword,
                        selectedRole
                    ],
                    (err, result) => {

                        if (err) {

                            console.error(
                                "User insert error:",
                                err
                            );

                            return res.status(500).json({
                                success: false,
                                message: "Failed to register user"
                            });
                        }

                        return res.status(201).json({
                            success: true,
                            message: "User Registered Successfully",
                            user: {
                                id: result.insertId,
                                full_name,
                                email,
                                phone: phone || null,
                                role: selectedRole
                            }
                        });
                    }
                );
            }
        );

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
};