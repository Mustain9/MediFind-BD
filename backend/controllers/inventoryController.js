const db = require("../config/db");

// ==========================================
// GET ALL INVENTORY
// ==========================================
exports.getInventory = (req, res) => {

    const sql = `
        SELECT
            inventory.id,
            inventory.pharmacy_id,
            inventory.medicine_id,
            inventory.stock,
            inventory.price,
            inventory.updated_at,

            medicines.brand_name,
            medicines.generic_name,
            medicines.strength,
            medicines.dosage_form,

            pharmacies.pharmacy_name,
            pharmacies.address

        FROM inventory

        JOIN medicines
            ON inventory.medicine_id = medicines.id

        JOIN pharmacies
            ON inventory.pharmacy_id = pharmacies.id

        ORDER BY inventory.id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.error("Inventory SQL Error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch inventory",
                error: err.message
            });
        }

        res.json({
            success: true,
            inventory: result
        });

    });
};


// ==========================================
// GET ONE PHARMACY'S INVENTORY
// ==========================================
exports.getPharmacyInventory = (req, res) => {

    const { pharmacyId } = req.params;

    const sql = `
        SELECT
            inventory.id,
            inventory.pharmacy_id,
            inventory.medicine_id,
            inventory.stock,
            inventory.price,
            inventory.updated_at,

            medicines.brand_name,
            medicines.generic_name,
            medicines.strength,
            medicines.dosage_form

        FROM inventory

        JOIN medicines
            ON inventory.medicine_id = medicines.id

        WHERE inventory.pharmacy_id = ?

        ORDER BY inventory.id DESC
    `;

    db.query(sql, [pharmacyId], (err, result) => {

        if (err) {

            console.error("Pharmacy Inventory Error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch pharmacy inventory"
            });

        }

        res.json({
            success: true,
            inventory: result
        });

    });
};


// ==========================================
// ADD INVENTORY
// ==========================================
exports.addInventory = (req, res) => {
    const { medicine_id, stock, price } = req.body;

    const userId = req.user.id;

    if (!medicine_id || stock == null || price == null) {
        return res.status(400).json({
            success: false,
            message: "Medicine, stock and price are required"
        });
    }

    // Find pharmacy belonging to logged-in user
    const pharmacySql = `
        SELECT id
        FROM pharmacies
        WHERE user_id = ?
        LIMIT 1
    `;

    db.query(pharmacySql, [userId], (err, pharmacyResult) => {

        if (err) {
            console.error("Pharmacy lookup error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to find pharmacy"
            });
        }

        if (pharmacyResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No pharmacy found for this account"
            });
        }

        // IMPORTANT:
        // This is pharmacies.id, NOT users.id
        const pharmacyId = pharmacyResult[0].id;

        // Check duplicate medicine
        const checkSql = `
            SELECT id
            FROM inventory
            WHERE pharmacy_id = ?
            AND medicine_id = ?
        `;

        db.query(
            checkSql,
            [pharmacyId, medicine_id],
            (err, existing) => {

                if (err) {
                    console.error("Inventory check error:", err);

                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });
                }

                if (existing.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: "This medicine already exists in this pharmacy inventory."
                    });
                }

                const insertSql = `
                    INSERT INTO inventory
                    (
                        pharmacy_id,
                        medicine_id,
                        stock,
                        price
                    )
                    VALUES (?, ?, ?, ?)
                `;

                db.query(
                    insertSql,
                    [
                        pharmacyId,
                        medicine_id,
                        stock,
                        price
                    ],
                    (err, result) => {

                        if (err) {
                            console.error("Add Inventory Error:", err);

                            return res.status(500).json({
                                success: false,
                                message: "Failed to add inventory",
                                error: err.message
                            });
                        }

                        res.status(201).json({
                            success: true,
                            message: "Medicine added successfully",
                            inventory_id: result.insertId
                        });
                    }
                );
            }
        );
    });
};


// ==========================================
// UPDATE INVENTORY
// ==========================================
exports.updateInventory = (req, res) => {

    const { id } = req.params;

    const {
        stock,
        price
    } = req.body;


    if (stock === undefined || price === undefined) {

        return res.status(400).json({
            success: false,
            message: "Stock and price are required"
        });

    }


    const sql = `
        UPDATE inventory
        SET
            stock = ?,
            price = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [stock, price, id],
        (err, result) => {

            if (err) {

                console.error("Update Inventory Error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update inventory",
                    error: err.message
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Inventory item not found"
                });

            }


            res.json({
                success: true,
                message: "Inventory updated successfully"
            });

        }
    );

};


// ==========================================
// DELETE INVENTORY
// ==========================================
exports.deleteInventory = (req, res) => {

    const { id } = req.params;


    db.query(
        "DELETE FROM inventory WHERE id = ?",
        [id],
        (err, result) => {

            if (err) {

                console.error("Delete Inventory Error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to delete inventory",
                    error: err.message
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Inventory item not found"
                });

            }


            res.json({
                success: true,
                message: "Inventory deleted successfully"
            });

        }
    );

};


// ==========================================
// GET LOGGED-IN PHARMACY INVENTORY
// ==========================================
exports.getMyInventory = (req, res) => {

    const userId = req.user.id;

    const pharmacySql = `
        SELECT id
        FROM pharmacies
        WHERE user_id = ?
        LIMIT 1
    `;

    db.query(pharmacySql, [userId], (err, pharmacyResult) => {

        if (err) {
            console.error("Pharmacy lookup error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to find pharmacy"
            });
        }

        if (pharmacyResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No pharmacy found for this account"
            });
        }

        const pharmacyId = pharmacyResult[0].id;

        const sql = `
            SELECT
                inventory.id,
                inventory.pharmacy_id,
                inventory.medicine_id,
                inventory.stock,
                inventory.price,
                inventory.updated_at,

                medicines.brand_name,
                medicines.generic_name,
                medicines.strength,
                medicines.dosage_form

            FROM inventory

            JOIN medicines
                ON inventory.medicine_id = medicines.id

            WHERE inventory.pharmacy_id = ?

            ORDER BY inventory.id DESC
        `;

        db.query(sql, [pharmacyId], (err, result) => {

            if (err) {
                console.error("My Inventory Error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch inventory"
                });
            }

            res.json({
                success: true,
                inventory: result
            });
        });
    });
};