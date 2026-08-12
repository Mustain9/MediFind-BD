const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const manufacturerRoutes = require("./routes/manufacturerRoutes");

const verifyToken = require("./middleware/authMiddleware");

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());


// ==========================================
// BASIC ROUTES
// ==========================================

app.get("/", (req, res) => {
    res.send("MediFind Backend Running");
});

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Backend Connected Successfully"
    });
});

// ==========================================
// ADMIN ROUTES
// ==========================================

app.use("/api/admin", adminRoutes);

// ==========================================
// AUTH ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

// ==========================================
// USER ROUTES
// ==========================================

app.use("/api/user", userRoutes);

// ==========================================
// MEDICINE ROUTES
// ==========================================

app.use("/api/medicines", medicineRoutes);

// ==========================================
// CATEGORY ROUTES
// ==========================================

app.use("/api/categories", categoryRoutes);

// ==========================================
// INVENTORY ROUTES
// ==========================================

app.use("/api/inventory", inventoryRoutes);

// ==========================================
// PHARMACY ROUTES
// ==========================================

app.use("/api/pharmacies", pharmacyRoutes);
app.use("/api/manufacturers", manufacturerRoutes);
app.use("/api/reservations", reservationRoutes);

// ==========================================
// RESERVATION ROUTES
// ==========================================

app.use("/api/reservations", reservationRoutes);

// ==========================================
// PROTECTED PROFILE ROUTE
// ==========================================

app.get("/api/profile", verifyToken, (req, res) => {
    res.json({
        success: true,
        message: "Protected Route Accessed",
        user: req.user
    });
});

// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server Running on http://localhost:${PORT}`);
});