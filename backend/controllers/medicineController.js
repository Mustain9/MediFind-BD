const db = require("../config/db");

// Get All Medicines
exports.getAllMedicines = (req, res) => {

    const search = req.query.search || "";

    const sql = `
        SELECT *
        FROM medicines
        WHERE
            brand_name LIKE ?
            OR generic_name LIKE ?
        ORDER BY id DESC
    `;

    db.query(
        sql,
        [`%${search}%`, `%${search}%`],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

};

// Add Medicine
exports.addMedicine = (req, res) => {

    const {
        brand_name,
        generic_name,
        manufacturer_id,
        strength,
        dosage_form,
        category_id,
        description,
        image
    } = req.body;

    if (!brand_name) {
        return res.status(400).json({
            success: false,
            message: "Brand name is required"
        });
    }

    const sql = `
        INSERT INTO medicines
        (
            brand_name,
            generic_name,
            manufacturer_id,
            strength,
            dosage_form,
            category_id,
            description,
            image
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            brand_name,
            generic_name || null,
            manufacturer_id || null,
            strength || null,
            dosage_form || null,
            category_id || null,
            description || null,
            image || null
        ],
        (err, result) => {

            if (err) {
                console.error("Add Medicine SQL Error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to add medicine",
                    error: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Medicine Added Successfully",
                medicine_id: result.insertId
            });

        }
    );
};
// Update Medicine
exports.updateMedicine = (req, res) => {

    const { id } = req.params;

    const {
        brand_name,
        generic_name,
        manufacturer_id,
        strength,
        dosage_form,
        category_id,
        description,
        image,
        status
    } = req.body;

    const sql = `
        UPDATE medicines
        SET
            brand_name = ?,
            generic_name = ?,
            manufacturer_id = ?,
            strength = ?,
            dosage_form = ?,
            category_id = ?,
            description = ?,
            image = ?,
            status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            brand_name,
            generic_name || null,
            manufacturer_id || null,
            strength || null,
            dosage_form || null,
            category_id || null,
            description || null,
            image || null,
            status || "active",
            id
        ],
        (err) => {

            if (err) {
                console.error("Update Medicine SQL Error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update medicine",
                    error: err.message
                });
            }

            res.json({
                success: true,
                message: "Medicine Updated Successfully"
            });

        }
    );
};

// Delete Medicine
exports.deleteMedicine = (req, res) => {

    const { id } = req.params;

    db.query(
        "DELETE FROM medicines WHERE id=?",
        [id],
        (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                success: true,
                message: "Medicine Deleted Successfully"
            });

        }
    );

};

// Get Medicine Statistics
exports.getMedicineStats = (req, res) => {

    const sql = `
        SELECT
            COUNT(*) AS totalMedicines,
            COUNT(DISTINCT category_id) AS totalCategories,
            COUNT(DISTINCT manufacturer_id) AS totalManufacturers,
            COUNT(DISTINCT NULLIF(TRIM(generic_name), '')) AS totalGenerics
        FROM medicines
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.error("Medicine Statistics SQL Error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to get medicine statistics",
                error: err.message
            });
        }

        res.json({
            success: true,
            statistics: result[0]
        });

    });

};

// ==========================================
// SEARCH MEDICINE WITH PHARMACY AVAILABILITY
// ==========================================
exports.searchMedicineAvailability = (req, res) => {

    const search = req.query.search || "";

    const sql = `
        SELECT
            medicines.id AS medicine_id,
            medicines.brand_name,
            medicines.generic_name,
            medicines.strength,
            medicines.dosage_form,

            pharmacies.id AS pharmacy_id,
            pharmacies.pharmacy_name,
            pharmacies.address,
            pharmacies.phone,
            pharmacies.latitude,
            pharmacies.longitude,

            inventory.stock,
            inventory.price

        FROM medicines

        JOIN inventory
            ON medicines.id = inventory.medicine_id

        JOIN pharmacies
            ON inventory.pharmacy_id = pharmacies.id

        WHERE
            (
                medicines.brand_name LIKE ?
                OR medicines.generic_name LIKE ?
            )
            AND pharmacies.status = 'approved'

        ORDER BY inventory.price ASC
    `;

    db.query(
        sql,
        [`%${search}%`, `%${search}%`],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to search medicine availability"
                });
            }

            res.json({
                success: true,
                results: result
            });
        }
    );
};