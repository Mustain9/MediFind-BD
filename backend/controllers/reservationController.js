const db = require("../config/db");

// ==========================================
// CREATE RESERVATION
// ==========================================
exports.createReservation = (req, res) => {

    const {
        user_id,
        pharmacy_id,
        medicine_id,
        quantity
    } = req.body;

    if (!user_id || !pharmacy_id || !medicine_id) {
        return res.status(400).json({
            success: false,
            message: "User, pharmacy and medicine are required"
        });
    }

    const requestedQuantity = quantity || 1;

    // Check stock first
    const stockSql = `
        SELECT stock
        FROM inventory
        WHERE pharmacy_id = ?
        AND medicine_id = ?
    `;

    db.query(
        stockSql,
        [pharmacy_id, medicine_id],
        (err, stockResult) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (stockResult.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Medicine is not available at this pharmacy"
                });
            }

            const stock = stockResult[0].stock;

            if (stock < requestedQuantity) {
                return res.status(400).json({
                    success: false,
                    message: "Not enough stock available"
                });
            }

            const insertSql = `
                INSERT INTO reservations
                (
                    user_id,
                    pharmacy_id,
                    medicine_id,
                    quantity,
                    status
                )
                VALUES (?, ?, ?, ?, 'pending')
            `;

            db.query(
                insertSql,
                [
                    user_id,
                    pharmacy_id,
                    medicine_id,
                    requestedQuantity
                ],
                (err, result) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Failed to create reservation"
                        });
                    }

                    res.status(201).json({
                        success: true,
                        message: "Reservation created successfully",
                        reservation_id: result.insertId
                    });
                }
            );
        }
    );
};


// ==========================================
// GET USER RESERVATIONS
// ==========================================
exports.getUserReservations = (req, res) => {

    const { userId } = req.params;

    const sql = `
        SELECT
            reservations.id,
            reservations.quantity,
            reservations.status,
            reservations.created_at,

            medicines.brand_name,
            medicines.generic_name,
            medicines.strength,

            pharmacies.pharmacy_name,
            pharmacies.address

        FROM reservations

        JOIN medicines
            ON reservations.medicine_id = medicines.id

        JOIN pharmacies
            ON reservations.pharmacy_id = pharmacies.id

        WHERE reservations.user_id = ?

        ORDER BY reservations.created_at DESC
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch reservations"
            });
        }

        res.json({
            success: true,
            reservations: result
        });
    });
};


// ==========================================
// GET PHARMACY RESERVATIONS
// ==========================================
exports.getPharmacyReservations = (req, res) => {

    const { pharmacyId } = req.params;

    const sql = `
        SELECT
            reservations.id,
            reservations.quantity,
            reservations.status,
            reservations.created_at,

            medicines.brand_name,
            medicines.generic_name,
            medicines.strength,

            users.full_name,
            users.phone,
            users.email

        FROM reservations

        JOIN medicines
            ON reservations.medicine_id = medicines.id

        JOIN users
            ON reservations.user_id = users.id

        WHERE reservations.pharmacy_id = ?

        ORDER BY reservations.created_at DESC
    `;

    db.query(sql, [pharmacyId], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch pharmacy reservations"
            });
        }

        res.json({
            success: true,
            reservations: result
        });
    });
};


// ==========================================
// UPDATE RESERVATION STATUS
// ==========================================
exports.updateReservationStatus = (req, res) => {

    const { id } = req.params;

    const { status } = req.body;

    const allowedStatuses = [
        "pending",
        "approved",
        "completed",
        "cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid reservation status"
        });
    }

    db.query(
        `
        UPDATE reservations
        SET status = ?
        WHERE id = ?
        `,
        [status, id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to update reservation"
                });
            }

            res.json({
                success: true,
                message: "Reservation status updated"
            });
        }
    );
};