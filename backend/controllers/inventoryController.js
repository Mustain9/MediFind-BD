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

    const {
        pharmacy_id,
        medicine_id,
        stock,
        price
    } = req.body;


    if (!pharmacy_id || !medicine_id) {

        return res.status(400).json({
            success: false,
            message: "Pharmacy and medicine are required"
        });

    }


    // Check whether this medicine
    // already exists for this pharmacy
    const checkSql = `
        SELECT id
        FROM inventory
        WHERE pharmacy_id = ?
        AND medicine_id = ?
    `;

    db.query(
        checkSql,
        [pharmacy_id, medicine_id],
        (err, existing) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });

            }


            if (existing.length > 0) {

                return res.status(409).json({
                    success: false,
                    message: "This medicine already exists in the pharmacy inventory"
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
                    pharmacy_id,
                    medicine_id,
                    stock || 0,
                    price || 0
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
                        message: "Medicine added to inventory",
                        inventory_id: result.insertId
                    });

                }
            );

        }
    );

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