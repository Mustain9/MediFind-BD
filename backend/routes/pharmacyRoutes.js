const express = require("express");

const router = express.Router();

const {
    getPharmacies,
    getAllPharmacies,
    getPharmacyById,
    createPharmacy,
    updatePharmacy,
    approvePharmacy,
    rejectPharmacy,
    getMyPharmacy
} = require("../controllers/pharmacyController");

const verifyToken = require("../middleware/authMiddleware");


// ==========================================
// LOGGED-IN PHARMACY
// ==========================================

router.get(
    "/my-pharmacy",
    verifyToken,
    getMyPharmacy
);


// ==========================================
// APPROVED PHARMACIES
// GET /api/pharmacies/approved
// IMPORTANT: MUST COME BEFORE /:id
// ==========================================

router.get(
    "/",
    getPharmacies
);


// ==========================================
// ADMIN - ALL PHARMACIES
// GET /api/pharmacies/all
// IMPORTANT: MUST COME BEFORE /:id
// ==========================================

router.get(
    "/all",
    getAllPharmacies
);


// ==========================================
// CREATE PHARMACY
// POST /api/pharmacies
// ==========================================

router.post(
    "/",
    createPharmacy
);


// ==========================================
// ADMIN - APPROVE PHARMACY
// PUT /api/pharmacies/:id/approve
// ==========================================

router.put(
    "/:id/approve",
    verifyToken,
    approvePharmacy
);


// ==========================================
// ADMIN - REJECT PHARMACY
// PUT /api/pharmacies/:id/reject
// ==========================================

router.put(
    "/:id/reject",
    verifyToken,
    rejectPharmacy
);


// ==========================================
// UPDATE PHARMACY
// PUT /api/pharmacies/:id
// ==========================================

router.put(
    "/:id",
    verifyToken,
    updatePharmacy
);


// ==========================================
// GET SINGLE PHARMACY
// GET /api/pharmacies/:id
// IMPORTANT: KEEP THIS LAST
// ==========================================

router.get(
    "/:id",
    getPharmacyById
);


module.exports = router;