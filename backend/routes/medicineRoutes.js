const express = require("express");

const router = express.Router();

const {
    getAllMedicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    getMedicineStats,
    searchMedicineAvailability
} = require("../controllers/medicineController");


// ==========================================
// GET ALL MEDICINES / SEARCH
// ==========================================
router.get("/", getAllMedicines);


// ==========================================
// GET MEDICINE STATISTICS
// ==========================================
router.get("/stats", getMedicineStats);


// ==========================================
// SEARCH MEDICINE WITH PHARMACY AVAILABILITY
// ==========================================
router.get(
    "/availability/search",
    searchMedicineAvailability
);


// ==========================================
// ADD MEDICINE
// ==========================================
router.post("/", addMedicine);


// ==========================================
// UPDATE MEDICINE
// ==========================================
router.put("/:id", updateMedicine);


// ==========================================
// DELETE MEDICINE
// ==========================================
router.delete("/:id", deleteMedicine);


module.exports = router;