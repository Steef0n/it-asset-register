const express = require("express");
const path = require("path");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/assets", (req, res) => {
    db.all(
        "SELECT * FROM assets ORDER BY id DESC",
        [],
        (error, rows) => {
            if (error) {
                return res.status(500).json({
                    message: error.message
                });
            }

            res.json(rows);
        }
    );
});

app.post("/api/assets", (req, res) => {
    const {
        assetNumber,
        user,
        department,
        deviceType,
        serialNumber,
        warrantyExpiry,
        location
    } = req.body;

    const sql = `
        INSERT INTO assets (
            assetNumber,
            user,
            department,
            deviceType,
            serialNumber,
            warrantyExpiry,
            location
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            assetNumber,
            user,
            department,
            deviceType,
            serialNumber,
            warrantyExpiry,
            location
        ],
        function (error) {
            if (error) {
                return res.status(500).json({
                    message: error.message
                });
            }

            res.status(201).json({
                id: this.lastID,
                assetNumber,
                user,
                department,
                deviceType,
                serialNumber,
                warrantyExpiry,
                location
            });
        }
    );
});

app.put("/api/assets/:id", (req, res) => {
    const id = Number(req.params.id);

    const {
        assetNumber,
        user,
        department,
        deviceType,
        serialNumber,
        warrantyExpiry,
        location
    } = req.body;

    const sql = `
        UPDATE assets
        SET assetNumber = ?,
            user = ?,
            department = ?,
            deviceType = ?,
            serialNumber = ?,
            warrantyExpiry = ?,
            location = ?
        WHERE id = ?
    `;

    db.run(
        sql,
        [
            assetNumber,
            user,
            department,
            deviceType,
            serialNumber,
            warrantyExpiry,
            location,
            id
        ],
        function (error) {
            if (error) {
                return res.status(500).json({
                    message: error.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Asset not found"
                });
            }

            res.json({
                id,
                assetNumber,
                user,
                department,
                deviceType,
                serialNumber,
                warrantyExpiry,
                location
            });
        }
    );
});

app.delete("/api/assets/:id", (req, res) => {
    const id = Number(req.params.id);

    db.run(
        "DELETE FROM assets WHERE id = ?",
        [id],
        function (error) {
            if (error) {
                return res.status(500).json({
                    message: error.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Asset not found"
                });
            }

            res.status(204).send();
        }
    );
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`IT Asset Register running on port ${PORT}`);
});