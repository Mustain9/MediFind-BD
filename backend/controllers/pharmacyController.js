const db = require("../config/db");

// ==========================================
// GET ALL APPROVED PHARMACIES
// ==========================================
exports.getPharmacies = (req, res) => {

    const sql = `
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
        WHERE status = 'approved'
        ORDER BY id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch pharmacies"
            });
        }

        res.json({
            success: true,
            pharmacies: result
        });
    });
};


// ==========================================
// GET ALL PHARMACIES - ADMIN
// ==========================================
exports.getAllPharmacies = (req, res) => {

    const sql = `
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
        ORDER BY id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch pharmacies"
            });
        }

        res.json({
            success: true,
            pharmacies: result
        });
    });
};


// ==========================================
// GET SINGLE PHARMACY
// ==========================================
exports.getPharmacyById = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT *
        FROM pharmacies
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Pharmacy not found"
            });
        }

        res.json({
            success: true,
            pharmacy: result[0]
        });
    });
};


// ==========================================
// REGISTER PHARMACY
// ==========================================
exports.createPharmacy = (req, res) => {

    const {
        pharmacy_name,
        owner_name,
        phone,
        email,
        address,
        latitude,
        longitude,
        opening_time,
        closing_time,
        user_id
    } = req.body;

    if (!pharmacy_name || !address) {
        return res.status(400).json({
            success: false,
            message: "Pharmacy name and address are required"
        });
    }

    const sql = `
        INSERT INTO pharmacies
        (
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
            user_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
    `;

    db.query(
        sql,
        [
            pharmacy_name,
            owner_name,
            phone,
            email,
            address,
            latitude || null,
            longitude || null,
            opening_time || null,
            closing_time || null,
            user_id || null
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to register pharmacy"
                });
            }

            res.status(201).json({
                success: true,
                message: "Pharmacy registered successfully. Waiting for admin approval.",
                pharmacy_id: result.insertId
            });
        }
    );
};


// ==========================================
// UPDATE PHARMACY
// ==========================================
exports.updatePharmacy = (req, res) => {

    const { id } = req.params;

    const {
        pharmacy_name,
        owner_name,
        phone,
        email,
        address,
        latitude,
        longitude,
        opening_time,
        closing_time
    } = req.body;

    const sql = `
        UPDATE pharmacies
        SET
            pharmacy_name = ?,
            owner_name = ?,
            phone = ?,
            email = ?,
            address = ?,
            latitude = ?,
            longitude = ?,
            opening_time = ?,
            closing_time = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            pharmacy_name,
            owner_name,
            phone,
            email,
            address,
            latitude || null,
            longitude || null,
            opening_time || null,
            closing_time || null,
            id
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update pharmacy"
                });
            }

            res.json({
                success: true,
                message: "Pharmacy updated successfully"
            });
        }
    );
};


// ==========================================
// APPROVE PHARMACY
// ==========================================
exports.approvePharmacy = (req, res) => {

    const { id } = req.params;

    db.query(
        `
        UPDATE pharmacies
        SET status = 'approved'
        WHERE id = ?
        `,
        [id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to approve pharmacy"
                });
            }

            res.json({
                success: true,
                message: "Pharmacy approved successfully"
            });
        }
    );
};


// ==========================================
// REJECT PHARMACY
// ==========================================
exports.rejectPharmacy = (req, res) => {

    const { id } = req.params;

    db.query(
        `
        UPDATE pharmacies
        SET status = 'rejected'
        WHERE id = ?
        `,
        [id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to reject pharmacy"
                });
            }

            res.json({
                success: true,
                message: "Pharmacy rejected successfully"
            });
        }
    );
};

// ==========================================
// GET LOGGED-IN USER'S PHARMACY
// ==========================================
exports.getMyPharmacy = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT *
        FROM pharmacies
        WHERE user_id = ?
        LIMIT 1
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {
            console.error("Get My Pharmacy Error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to find pharmacy",
                error: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No pharmacy found for this account"
            });
        }

        res.json({
            success: true,
            pharmacy: result[0]
        });

    });
};