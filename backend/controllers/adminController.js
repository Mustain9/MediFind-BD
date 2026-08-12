const db = require("../config/db");

// ==========================================
// ADMIN DASHBOARD
// ==========================================
exports.getDashboard = (req, res) => {

    const queries = {

        // Total users
        totalUsers: `
            SELECT COUNT(*) AS total
            FROM users
        `,

        // Pharmacy statistics
        pharmacies: `
            SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approved,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
                SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejected
            FROM pharmacies
        `,

        // Total medicines
        totalMedicines: `
            SELECT COUNT(*) AS total
            FROM medicines
        `,

        // Total reservations
        totalReservations: `
            SELECT COUNT(*) AS total
            FROM reservations
        `,

        // Today's reservations
        todayReservations: `
            SELECT COUNT(*) AS total
            FROM reservations
            WHERE DATE(created_at) = CURDATE()
        `,

        // Pending reservations
        pendingReservations: `
            SELECT COUNT(*) AS total
            FROM reservations
            WHERE LOWER(status) = 'pending'
        `,

        // Pending pharmacies
        pendingPharmacies: `
            SELECT
                id,
                pharmacy_name,
                owner_name,
                phone,
                email,
                address,
                latitude,
                longitude,
                opening_time,
                closing_time,
                status,
                user_id,
                created_at
            FROM pharmacies
            WHERE status = 'pending'
            ORDER BY id DESC
            LIMIT 5
        `
    };


    // ==========================================
    // RUN ALL QUERIES
    // ==========================================

    db.query(
        queries.totalUsers,
        (err, usersResult) => {

            if (err) {
                console.error("Dashboard users error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to load user statistics",
                    error: err.message
                });
            }


            db.query(
                queries.pharmacies,
                (err, pharmacyResult) => {

                    if (err) {
                        console.error("Dashboard pharmacy error:", err);

                        return res.status(500).json({
                            success: false,
                            message: "Failed to load pharmacy statistics",
                            error: err.message
                        });
                    }


                    db.query(
                        queries.totalMedicines,
                        (err, medicinesResult) => {

                            if (err) {
                                console.error(
                                    "Dashboard medicine error:",
                                    err
                                );

                                return res.status(500).json({
                                    success: false,
                                    message: "Failed to load medicine statistics",
                                    error: err.message
                                });
                            }


                            db.query(
                                queries.totalReservations,
                                (err, reservationsResult) => {

                                    if (err) {
                                        console.error(
                                            "Dashboard reservation error:",
                                            err
                                        );

                                        return res.status(500).json({
                                            success: false,
                                            message: "Failed to load reservation statistics",
                                            error: err.message
                                        });
                                    }


                                    db.query(
                                        queries.todayReservations,
                                        (err, todayResult) => {

                                            if (err) {
                                                console.error(
                                                    "Today's reservations error:",
                                                    err
                                                );

                                                return res.status(500).json({
                                                    success: false,
                                                    message: "Failed to load today's reservations",
                                                    error: err.message
                                                });
                                            }


                                            db.query(
                                                queries.pendingReservations,
                                                (err, pendingReservationResult) => {

                                                    if (err) {
                                                        console.error(
                                                            "Pending reservations error:",
                                                            err
                                                        );

                                                        return res.status(500).json({
                                                            success: false,
                                                            message: "Failed to load pending reservations",
                                                            error: err.message
                                                        });
                                                    }


                                                    db.query(
                                                        queries.pendingPharmacies,
                                                        (err, pendingPharmaciesResult) => {

                                                            if (err) {
                                                                console.error(
                                                                    "Pending pharmacies error:",
                                                                    err
                                                                );

                                                                return res.status(500).json({
                                                                    success: false,
                                                                    message: "Failed to load pending pharmacies",
                                                                    error: err.message
                                                                });
                                                            }


                                                            // ==========================================
                                                            // FINAL RESPONSE
                                                            // ==========================================

                                                            const pharmacyStats =
                                                                pharmacyResult[0] || {};

                                                            res.json({

                                                                success: true,

                                                                stats: {

                                                                    totalUsers:
                                                                        Number(
                                                                            usersResult[0]?.total || 0
                                                                        ),

                                                                    totalPharmacies:
                                                                        Number(
                                                                            pharmacyStats.total || 0
                                                                        ),

                                                                    approvedPharmacies:
                                                                        Number(
                                                                            pharmacyStats.approved || 0
                                                                        ),

                                                                    pendingPharmacies:
                                                                        Number(
                                                                            pharmacyStats.pending || 0
                                                                        ),

                                                                    rejectedPharmacies:
                                                                        Number(
                                                                            pharmacyStats.rejected || 0
                                                                        ),

                                                                    totalMedicines:
                                                                        Number(
                                                                            medicinesResult[0]?.total || 0
                                                                        ),

                                                                    totalReservations:
                                                                        Number(
                                                                            reservationsResult[0]?.total || 0
                                                                        ),

                                                                    todayReservations:
                                                                        Number(
                                                                            todayResult[0]?.total || 0
                                                                        ),

                                                                    pendingReservations:
                                                                        Number(
                                                                            pendingReservationResult[0]?.total || 0
                                                                        )
                                                                },

                                                                pendingPharmacies:
                                                                    pendingPharmaciesResult

                                                            });

                                                        }
                                                    );

                                                }
                                            );

                                        }
                                    );

                                }
                            );

                        }
                    );

                }
            );

        }
    );

};