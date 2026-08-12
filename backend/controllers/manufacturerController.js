const db = require("../config/db");

// ==========================================
// GET ALL MANUFACTURERS
// ==========================================
exports.getAllManufacturers = (req, res) => {

    const sql = `
        SELECT
            id,
            manufacturer_name,
            address,
            phone,
            email,
            website,
            created_at
        FROM manufacturers
        ORDER BY manufacturer_name ASC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.error(
                "Get Manufacturers Error:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Failed to fetch manufacturers",
                error: err.message
            });
        }

        res.json({
            success: true,
            manufacturers: result
        });
    });
};


// ==========================================
// GET SINGLE MANUFACTURER
// ==========================================
exports.getManufacturerById = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT *
        FROM manufacturers
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error(
                "Get Manufacturer Error:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Failed to fetch manufacturer",
                error: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Manufacturer not found"
            });
        }

        res.json({
            success: true,
            manufacturer: result[0]
        });
    });
};