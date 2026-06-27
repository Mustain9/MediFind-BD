const db = require("../config/db");

// Get All Categories
exports.getCategories = (req, res) => {
    db.query(
        "SELECT * FROM categories ORDER BY id DESC",
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);
        }
    );
};

// Add Category
exports.addCategory = (req, res) => {

    const { category_name, description } = req.body;

    if (!category_name) {
        return res.status(400).json({
            success: false,
            message: "Category name is required"
        });
    }

    db.query(
        "INSERT INTO categories(category_name,description) VALUES(?,?)",
        [category_name, description],
        (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                success: true,
                message: "Category Added Successfully"
            });

        }
    );
};