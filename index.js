// File: server/index.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Ye CORS error khatam kar dega

// MongoDB Connection
// Note: Niche 'MONGO_URI' mein apna connection string dalna hoga
const MONGO_URI = process.env.MONGO_URI ;

mongoose.connect(MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Connection Error:", err));

// --- Schema & Model ---
const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, default: "Verified User" },
    review: { type: String, required: true },
    rating: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

// --- Routes ---

// 1. Get All Reviews
app.get('/api/reviews', async (req, res) => {
    try {
        // Newest reviews first
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/', (req, res) => {
    res.send("New Tech Softs API is running...");
});
// 2. Add New Review
app.post('/api/reviews', async (req, res) => {
    try {
        const { name, review, rating } = req.body;
        
        const newReview = new Review({
            name,
            review,
            rating,
            role: "Verified User" 
        });

        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));