const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/db");

// Login User
exports.login = (req, res) => {

    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            const user = result[0];

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid password"
                });
            }

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

            res.json({
                success: true,
                message: "Login Successful",
                token,
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    role: user.role
                }
            });

        }
    );
};

// Register User
exports.register = async (req, res) => {
    const { full_name, email, phone, password, role } = req.body;
    console.log(req.body);

    try {
        // Check if email already exists
        db.query(
            "SELECT * FROM users WHERE email = ?",
            [email],
            async (err, result) => {
                if (err) return res.status(500).json(err);

                if (result.length > 0) {
                    return res.status(400).json({
                        message: "Email already exists"
                    });
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                db.query(
                    "INSERT INTO users(full_name,email,phone,password,role) VALUES (?,?,?,?,?)",
                    [
                        full_name,
                        email,
                        phone,
                        hashedPassword,
                        role || "customer"
                    ],
                    (err) => {
                        if (err) return res.status(500).json(err);

                        res.status(201).json({
                            success: true,
                            message: "User Registered Successfully"
                        });
                    }
                );
            }
        );

    } catch (error) {
        res.status(500).json(error);
    }
};