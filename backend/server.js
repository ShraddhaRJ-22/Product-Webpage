import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";

dotenv.config();

const app = express(); //  Initialize Express first
const PORT = process.env.PORT || 5001;

app.use(cors()); //  Move cors() here, after app is initialized
app.use(express.json()); // Allows us to accept JSON data in req.body

// API Routes
app.use("/api/products", productRoutes);

// Start the server
app.listen(PORT, () => {
    connectDB();
    console.log(`Server started at http://localhost:${PORT}`);
});
