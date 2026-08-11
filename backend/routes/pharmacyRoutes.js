const express = require("express");

const router = express.Router();

const {
    getPharmacies,
    getAllPharmacies,
    getPharmacyById,
    createPharmacy,
    updatePharmacy,
    approvePharmacy,
    rejectPharmacy
} = require("../controllers/pharmacyController");


// Get approved pharmacies
router.get("/", getPharmacies);

// Get all pharmacies - admin
router.get("/all", getAllPharmacies);

// Get single pharmacy
router.get("/:id", getPharmacyById);

// Create pharmacy
router.post("/", createPharmacy);

// Update pharmacy
router.put("/:id", updatePharmacy);

// Approve pharmacy
router.put("/:id/approve", approvePharmacy);

// Reject pharmacy
router.put("/:id/reject", rejectPharmacy);


module.exports = router;