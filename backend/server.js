const categoryRoutes = require("./routes/categoryRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const express = require("express");

const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

const verifyToken = require("./middleware/authMiddleware");
app.get("/api/profile", verifyToken, (req, res) => {
    res.json({
        success: true,
        message: "Protected Route Accessed",
        user: req.user
    });
});


// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/medicines", medicineRoutes);
app.use("/api/categories", categoryRoutes);

// Routes
app.get("/", (req, res) => {
    res.send("MediFind Backend Running");
});

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Backend Connected Successfully"
    });
});

app.use("/api/auth", authRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server Running on http://localhost:${PORT}`);
});