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
        manufacturer,
        strength,
        description
    } = req.body;

    const sql = `
    INSERT INTO medicines
    (brand_name,generic_name,manufacturer,strength,description)
    VALUES (?,?,?,?,?)
    `;

    db.query(
        sql,
        [
            brand_name,
            generic_name,
            manufacturer,
            strength,
            description
        ],
        (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                success: true,
                message: "Medicine Added Successfully"
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
        manufacturer,
        strength,
        description
    } = req.body;

    const sql = `
        UPDATE medicines
        SET
            brand_name=?,
            generic_name=?,
            manufacturer=?,
            strength=?,
            description=?
        WHERE id=?
    `;

    db.query(
        sql,
        [
            brand_name,
            generic_name,
            manufacturer,
            strength,
            description,
            id
        ],
        (err) => {

            if (err) {
                return res.status(500).json(err);
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

exports.getMedicineStats = (req, res) => {

    const sql = `
        SELECT
            COUNT(*) AS totalMedicines,
            COUNT(DISTINCT category) AS totalCategories,
            COUNT(DISTINCT manufacturer) AS totalManufacturers,
            COUNT(DISTINCT generic_name) AS totalGenerics
        FROM medicines
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result[0]);

    });

};