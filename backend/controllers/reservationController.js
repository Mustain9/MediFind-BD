const db = require("../config/db");

// Create a reservation and temporarily reserve stock.
exports.createReservation = (req, res) => {
    const { user_id, pharmacy_id, medicine_id, quantity } = req.body;

    const userId = Number(user_id);
    const pharmacyId = Number(pharmacy_id);
    const medicineId = Number(medicine_id);
    const qty = Number(quantity);

    if (!userId || !pharmacyId || !medicineId || !Number.isInteger(qty) || qty < 1) {
        return res.status(400).json({
            success: false,
            message: "Valid user, pharmacy, medicine and quantity are required."
        });
    }

    const inventorySql = `
        SELECT id, stock, price
        FROM inventory
        WHERE pharmacy_id = ? AND medicine_id = ?
        LIMIT 1
    `;

    db.query(inventorySql, [pharmacyId, medicineId], (err, rows) => {
        if (err) {
            console.error("Inventory lookup error:", err);
            return res.status(500).json({
                success: false,
                message: "Failed to check medicine availability."
            });
        }

        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: "This medicine is not listed in this pharmacy."
            });
        }

        const inventory = rows[0];

        if (Number(inventory.stock) < qty) {
            return res.status(400).json({
                success: false,
                message: `Only ${inventory.stock} unit(s) are available.`
            });
        }

        // Reserve the stock immediately so two customers cannot reserve
        // the same available units during the demo workflow.
        db.query(
            `UPDATE inventory
             SET stock = stock - ?
             WHERE id = ? AND stock >= ?`,
            [qty, inventory.id, qty],
            (updateErr, updateResult) => {
                if (updateErr) {
                    console.error("Stock reservation error:", updateErr);
                    return res.status(500).json({
                        success: false,
                        message: "Failed to reserve stock."
                    });
                }

                if (updateResult.affectedRows !== 1) {
                    return res.status(409).json({
                        success: false,
                        message: "Stock changed. Please try again."
                    });
                }

                const insertSql = `
                    INSERT INTO reservations
                    (user_id, pharmacy_id, medicine_id, quantity, status)
                    VALUES (?, ?, ?, ?, 'pending')
                `;

                db.query(
                    insertSql,
                    [userId, pharmacyId, medicineId, qty],
                    (insertErr, result) => {
                        if (insertErr) {
                            console.error("Reservation insert error:", insertErr);

                            // Restore stock if reservation creation failed.
                            db.query(
                                `UPDATE inventory SET stock = stock + ? WHERE id = ?`,
                                [qty, inventory.id],
                                () => {}
                            );

                            return res.status(500).json({
                                success: false,
                                message: "Failed to create reservation."
                            });
                        }

                        return res.status(201).json({
                            success: true,
                            message: "Reservation created successfully.",
                            reservation_id: result.insertId,
                            status: "pending"
                        });
                    }
                );
            }
        );
    });
};


// Get reservations for one customer.
exports.getUserReservations = (req, res) => {
    const userId = Number(req.params.userId);

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "Invalid user ID."
        });
    }

    const sql = `
        SELECT
            r.id,
            r.user_id,
            r.pharmacy_id,
            r.medicine_id,
            r.quantity,
            r.status,
            r.created_at,
            m.brand_name,
            m.generic_name,
            m.strength,
            p.pharmacy_name,
            p.address,
            i.price
        FROM reservations r
        JOIN medicines m ON m.id = r.medicine_id
        JOIN pharmacies p ON p.id = r.pharmacy_id
        LEFT JOIN inventory i
            ON i.pharmacy_id = r.pharmacy_id
            AND i.medicine_id = r.medicine_id
        WHERE r.user_id = ?
        ORDER BY r.created_at DESC
    `;

    db.query(sql, [userId], (err, rows) => {
        if (err) {
            console.error("User reservations error:", err);
            return res.status(500).json({
                success: false,
                message: "Failed to load reservations."
            });
        }

        res.json({
            success: true,
            reservations: rows
        });
    });
};


// Get reservations for one pharmacy.
exports.getPharmacyReservations = (req, res) => {
    const pharmacyId = Number(req.params.pharmacyId);

    if (!pharmacyId) {
        return res.status(400).json({
            success: false,
            message: "Invalid pharmacy ID."
        });
    }

    const sql = `
        SELECT
            r.id,
            r.user_id,
            r.pharmacy_id,
            r.medicine_id,
            r.quantity,
            r.status,
            r.created_at,
            u.full_name,
            u.email,
            m.brand_name,
            m.generic_name,
            m.strength,
            i.price
        FROM reservations r
        JOIN users u ON u.id = r.user_id
        JOIN medicines m ON m.id = r.medicine_id
        LEFT JOIN inventory i
            ON i.pharmacy_id = r.pharmacy_id
            AND i.medicine_id = r.medicine_id
        WHERE r.pharmacy_id = ?
        ORDER BY r.created_at DESC
    `;

    db.query(sql, [pharmacyId], (err, rows) => {
        if (err) {
            console.error("Pharmacy reservations error:", err);
            return res.status(500).json({
                success: false,
                message: "Failed to load pharmacy reservations."
            });
        }

        res.json({
            success: true,
            reservations: rows
        });
    });
};


// Pharmacy changes reservation status.
exports.updateReservationStatus = (req, res) => {
    const reservationId = Number(req.params.id);
    const pharmacyId = Number(req.body.pharmacy_id);
    const newStatus = String(req.body.status || "").toLowerCase();

    const allowedStatuses = ["approved", "completed", "cancelled"];

    if (!reservationId || !pharmacyId || !allowedStatuses.includes(newStatus)) {
        return res.status(400).json({
            success: false,
            message: "Invalid reservation status request."
        });
    }

    const selectSql = `
        SELECT
            r.id,
            r.pharmacy_id,
            r.medicine_id,
            r.quantity,
            r.status
        FROM reservations r
        WHERE r.id = ? AND r.pharmacy_id = ?
        LIMIT 1
    `;

    db.query(selectSql, [reservationId, pharmacyId], (err, rows) => {
        if (err) {
            console.error("Reservation lookup error:", err);
            return res.status(500).json({
                success: false,
                message: "Failed to find reservation."
            });
        }

        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found."
            });
        }

        const reservation = rows[0];
        const currentStatus = String(reservation.status).toLowerCase();

        // Valid workflow:
        // pending -> approved
        // pending -> cancelled (restore stock)
        // approved -> completed
        if (
            (currentStatus === "pending" &&
                !["approved", "cancelled"].includes(newStatus)) ||
            (currentStatus === "approved" && newStatus !== "completed") ||
            ["completed", "cancelled"].includes(currentStatus)
        ) {
            return res.status(409).json({
                success: false,
                message: `Cannot change ${currentStatus} reservation to ${newStatus}.`
            });
        }

        const updateSql = `
            UPDATE reservations
            SET status = ?
            WHERE id = ? AND pharmacy_id = ?
        `;

        db.query(
            updateSql,
            [newStatus, reservationId, pharmacyId],
            (updateErr, result) => {
                if (updateErr) {
                    console.error("Reservation update error:", updateErr);
                    return res.status(500).json({
                        success: false,
                        message: "Failed to update reservation."
                    });
                }

                if (!result.affectedRows) {
                    return res.status(404).json({
                        success: false,
                        message: "Reservation was not updated."
                    });
                }

                // Stock was removed when the reservation was created.
                // If the pharmacy cancels/rejects it, put the stock back.
                if (newStatus === "cancelled") {
                    db.query(
                        `
                        UPDATE inventory
                        SET stock = stock + ?
                        WHERE pharmacy_id = ? AND medicine_id = ?
                        `,
                        [
                            reservation.quantity,
                            pharmacyId,
                            reservation.medicine_id
                        ],
                        (restoreErr) => {
                            if (restoreErr) {
                                console.error("Stock restore error:", restoreErr);
                            }

                            return res.json({
                                success: true,
                                message: "Reservation cancelled and stock restored.",
                                status: "cancelled"
                            });
                        }
                    );
                    return;
                }

                return res.json({
                    success: true,
                    message: `Reservation ${newStatus}.`,
                    status: newStatus
                });
            }
        );
    });
};
