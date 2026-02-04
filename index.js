require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 1. Middlewares (Hamesha top par hone chahiyen)
app.use(express.json());
app.use(cors()); 

// 2. MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Connection Error:", err));

// 3. Schema & Model
const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, default: "Verified User" },
    review: { type: String, required: true },
    rating: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

// --- ROUTES ---

// 4. Root Route (Ab ye text nahi, JSON bhejega taake frontend crash na ho)
app.get('/', (req, res) => {
    res.json({ 
        message: "New Tech Softs API is live!",
        endpoints: {
            get_reviews: "/api/reviews (GET)",
            add_review: "/api/reviews (POST)"
        }
    });
});

// 5. Get All Reviews
app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Add New Review
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

// 7. Start Server (Render ke liye port 10000 behtar hai)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));