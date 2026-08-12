const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getInventory,
    getPharmacyInventory,
    getMyInventory,
    addInventory,
    updateInventory,
    deleteInventory
} = require("../controllers/inventoryController");

// Get logged-in pharmacy inventory
router.get("/my-inventory", verifyToken, getMyInventory);

// Get all inventory
router.get("/", verifyToken, getInventory);

// Get specific pharmacy inventory
router.get(
    "/pharmacy/:pharmacyId",
    verifyToken,
    getPharmacyInventory
);

// Add inventory
router.post("/", verifyToken, addInventory);

// Update inventory
router.put("/:id", verifyToken, updateInventory);

// Delete inventory
router.delete("/:id", verifyToken, deleteInventory);

module.exports = router;