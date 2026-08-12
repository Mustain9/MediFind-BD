const express = require("express");

const router = express.Router();

const {
    getAllManufacturers,
    getManufacturerById
} = require("../controllers/manufacturerController");


// ==========================================
// GET ALL MANUFACTURERS
// ==========================================

router.get(
    "/",
    getAllManufacturers
);


// ==========================================
// GET SINGLE MANUFACTURER
// ==========================================

router.get(
    "/:id",
    getManufacturerById
);


module.exports = router;