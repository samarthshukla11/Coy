const profileRoutes = require("./routes/profileRoutes");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./database/db");

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Coy backend is running!"
    });
});

// Database test route
app.get("/api/test-db", (req, res) => {
    const result = db.prepare("SELECT COUNT(*) AS total FROM users").get();

    res.json({
        message: "Database connected successfully!",
        totalProfiles: result.total
    });
});

const PORT = process.env.PORT || 5000;

app.use("/api", profileRoutes);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});