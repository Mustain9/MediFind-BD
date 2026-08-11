const express = require("express");
const router = express.Router();

const {
    createReservation,
    getUserReservations,
    getPharmacyReservations,
    updateReservationStatus
} = require("../controllers/reservationController");

router.post("/", createReservation);

router.get("/user/:userId", getUserReservations);

router.get("/pharmacy/:pharmacyId", getPharmacyReservations);

router.patch("/:id/status", updateReservationStatus);

module.exports = router;
