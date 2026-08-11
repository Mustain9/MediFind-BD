const express = require("express");

const router = express.Router();

const {
    createReservation,
    getUserReservations,
    getPharmacyReservations,
    updateReservationStatus
} = require("../controllers/reservationController");


// Create reservation
router.post("/", createReservation);

// Get customer's reservations
router.get("/user/:userId", getUserReservations);

// Get pharmacy reservations
router.get("/pharmacy/:pharmacyId", getPharmacyReservations);

// Update reservation status
router.put("/:id/status", updateReservationStatus);


module.exports = router;