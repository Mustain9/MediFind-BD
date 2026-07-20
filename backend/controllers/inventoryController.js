const db = require("../config/db");

// Get all inventory
exports.getInventory = (req, res) => {

    const sql = `
        SELECT
            inventory.id,
            inventory.stock,
            inventory.price,
            medicines.brand_name,
            medicines.generic_name
        FROM inventory
        JOIN medicines
        ON inventory.medicine_id = medicines.id
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);

    });

};