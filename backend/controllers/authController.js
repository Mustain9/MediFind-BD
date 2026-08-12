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

                console.error(
                    "Password/JWT error:",
                    error
                );

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
        address,
        role,
        pharmacy_name,
        license_number
    } = req.body;

    console.log(
        "Registration request:",
        req.body
    );


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
            message:
                "Full name, email and password are required"
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


    // ==========================================
    // PHARMACY VALIDATION
    // ==========================================

    if (selectedRole === "pharmacy") {

        if (!pharmacy_name) {

            return res.status(400).json({
                success: false,
                message:
                    "Pharmacy name is required"
            });
        }

        if (!address) {

            return res.status(400).json({
                success: false,
                message:
                    "Pharmacy address is required"
            });
        }

        if (!license_number) {

            return res.status(400).json({
                success: false,
                message:
                    "Pharmacy license number is required"
            });
        }
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


                // ==========================================
                // EMAIL EXISTS
                // ==========================================

                if (result.length > 0) {

                    return res.status(400).json({
                        success: false,
                        message:
                            "Email already exists"
                    });
                }


                // ==========================================
                // HASH PASSWORD
                // ==========================================

                let hashedPassword;

                try {

                    hashedPassword =
                        await bcrypt.hash(
                            password,
                            10
                        );

                } catch (hashError) {

                    console.error(
                        "Password hashing error:",
                        hashError
                    );

                    return res.status(500).json({
                        success: false,
                        message:
                            "Failed to secure password"
                    });
                }


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
                        full_name.trim(),
                        email.trim(),
                        phone || null,
                        hashedPassword,
                        selectedRole
                    ],
                    (userErr, userResult) => {

                        if (userErr) {

                            console.error(
                                "User insert error:",
                                userErr
                            );

                            return res.status(500).json({
                                success: false,
                                message:
                                    "Failed to register user",
                                error:
                                    userErr.message
                            });
                        }


                        // New user ID
                        const userId =
                            userResult.insertId;


                        // ==========================================
                        // CUSTOMER REGISTRATION
                        // ==========================================

                        if (
                            selectedRole ===
                            "customer"
                        ) {

                            return res.status(201).json({
                                success: true,
                                message:
                                    "User Registered Successfully",

                                user: {
                                    id: userId,
                                    full_name,
                                    email,
                                    phone:
                                        phone || null,
                                    role:
                                        selectedRole
                                }
                            });
                        }


                        // ==========================================
                        // PHARMACY REGISTRATION
                        // ==========================================

                        const pharmacySql = `
                            INSERT INTO pharmacies
                            (
                                pharmacy_name,
                                owner_name,
                                phone,
                                email,
                                address,
                                latitude,
                                longitude,
                                opening_time,
                                closing_time,
                                status,
                                user_id
                            )
                            VALUES
                            (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
                        `;


                        db.query(
                            pharmacySql,
                            [
                                pharmacy_name.trim(),
                                full_name.trim(),
                                phone || null,
                                email.trim(),
                                address.trim(),
                                null,
                                null,
                                null,
                                null,
                                userId
                            ],
                            (pharmacyErr, pharmacyResult) => {

                                if (pharmacyErr) {

                                    console.error(
                                        "Pharmacy insert error:",
                                        pharmacyErr
                                    );

                                    /*
                                     * User was created but pharmacy
                                     * creation failed.
                                     *
                                     * Delete the user so we don't
                                     * leave an incomplete account.
                                     */

                                    db.query(
                                        "DELETE FROM users WHERE id = ?",
                                        [userId],
                                        () => {

                                            return res.status(500).json({
                                                success: false,
                                                message:
                                                    "Failed to create pharmacy. Registration was cancelled.",
                                                error:
                                                    pharmacyErr.message
                                            });

                                        }
                                    );

                                    return;
                                }


                                // ==========================================
                                // SUCCESS
                                // ==========================================

                                return res.status(201).json({

                                    success: true,

                                    message:
                                        "Pharmacy registration submitted successfully. Waiting for admin approval.",

                                    user: {
                                        id: userId,
                                        full_name,
                                        email,
                                        phone:
                                            phone || null,
                                        role:
                                            selectedRole
                                    },

                                    pharmacy: {
                                        id:
                                            pharmacyResult.insertId,

                                        pharmacy_name:
                                            pharmacy_name,

                                        owner_name:
                                            full_name,

                                        status:
                                            "pending"
                                    }

                                });

                            }
                        );

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
            message:
                "Registration failed",
            error:
                error.message
        });
    }
};