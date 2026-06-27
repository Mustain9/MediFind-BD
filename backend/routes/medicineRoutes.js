const express = require("express");

const router = express.Router();

const {

    getAllMedicines,

    addMedicine

} = require("../controllers/medicineController");

router.get("/", getAllMedicines);

router.post("/", addMedicine);

module.exports = router;