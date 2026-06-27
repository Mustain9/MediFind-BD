const db = require("../config/db");

// Get All Medicines
exports.getAllMedicines = (req, res) => {

    db.query("SELECT * FROM medicines ORDER BY id DESC", (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);

    });

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