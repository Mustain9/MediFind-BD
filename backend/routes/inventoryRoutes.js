const express = require("express");

const router = express.Router();

const {
    getInventory,
    getPharmacyInventory,
    addInventory,
    updateInventory,
    deleteInventory
} = require("../controllers/inventoryController");


router.get("/", getInventory);

router.get(
    "/pharmacy/:pharmacyId",
    getPharmacyInventory
);

router.post("/", addInventory);

router.put("/:id", updateInventory);

router.delete("/:id", deleteInventory);


module.exports = router;