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
// ==========================================

router.get(
    "/",
    getPharmacies
);


// ==========================================
// ADMIN - ALL PHARMACIES
// IMPORTANT: MUST COME BEFORE /:id
// ==========================================

router.get(
    "/all",
    getAllPharmacies
);


// ==========================================
// CREATE PHARMACY
// ==========================================

router.post(
    "/",
    createPharmacy
);


// ==========================================
// ADMIN - APPROVE PHARMACY
// ==========================================

router.put(
    "/:id/approve",
    verifyToken,
    approvePharmacy
);


// ==========================================
// ADMIN - REJECT PHARMACY
// ==========================================

router.put(
    "/:id/reject",
    verifyToken,
    rejectPharmacy
);


// ==========================================
// UPDATE PHARMACY
// ==========================================

router.put(
    "/:id",
    verifyToken,
    updatePharmacy
);


// ==========================================
// GET SINGLE PHARMACY
// IMPORTANT: KEEP THIS LAST
// ==========================================

router.get(
    "/:id",
    getPharmacyById
);


module.exports = router;