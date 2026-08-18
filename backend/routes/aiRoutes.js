const express = require("express");

const router = express.Router();

const {
    aiMedicineSearch
} = require("../controllers/aiController");


// ==========================================
// AI MEDICINE SEARCH
// ==========================================

router.post(
    "/medicine-search",
    aiMedicineSearch
);


module.exports = router;