const express = require("express");

const router = express.Router();

const {
    getAllMedicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    getMedicineStats
} = require("../controllers/medicineController");

router.get("/", getAllMedicines);
router.get("/stats", getMedicineStats);

router.post("/", addMedicine);
router.put("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);

module.exports = router;