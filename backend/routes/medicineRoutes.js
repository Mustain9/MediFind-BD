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

const verifyToken =
    require("../middleware/authMiddleware");


// ==========================================
// PUBLIC - GET ALL MEDICINES / SEARCH
// ==========================================

router.get(
    "/",
    getAllMedicines
);


// ==========================================
// PUBLIC - MEDICINE AVAILABILITY SEARCH
// ==========================================

router.get(
    "/availability/search",
    searchMedicineAvailability
);


// ==========================================
// ADMIN - MEDICINE STATISTICS
// ==========================================

router.get(
    "/stats",
    verifyToken,
    getMedicineStats
);


// ==========================================
// ADMIN - ADD MEDICINE
// ==========================================

router.post(
    "/",
    verifyToken,
    addMedicine
);


// ==========================================
// ADMIN - UPDATE MEDICINE
// ==========================================

router.put(
    "/:id",
    verifyToken,
    updateMedicine
);


// ==========================================
// ADMIN - DELETE MEDICINE
// ==========================================

router.delete(
    "/:id",
    verifyToken,
    deleteMedicine
);


module.exports = router;