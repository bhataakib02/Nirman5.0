const express = require('express');
const Request = require('../models/request');
const authenticateToken = require('../middlewares/auth');
const notifyNearby = require('../sockets/notify');

const router = express.Router();

// GET /requests?lat&lng&radiusKm
router.get('/', async (req, res) => {
    try {
        const { lat, lng, radiusKm } = req.query;

        if (!lat || !lng || !radiusKm) {
            return res.status(400).json({ error: 'Missing lat, lng, or radiusKm' });
        }

        const requests = await Request.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)],
                    },
                    $maxDistance: parseFloat(radiusKm) * 1000, // Convert km to meters
                },
            },
        }).populate('requesterId', 'name email');

        res.json(requests);
    } catch (error) {
        console.error('Get Requests Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST /requests
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { type, description, contact, lat, lng } = req.body;

        if (!type || !description || !lat || !lng) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const request = new Request({
            requesterId: req.user.userId,
            type,
            description,
            contact,
            location: {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)],
            },
        });

        await request.save();

        // Notify nearby volunteers
        const io = req.app.get('io');
        const userSocketMap = req.app.get('userSocketMap');
        notifyNearby(io, userSocketMap, request);

        res.status(201).json(request);
    } catch (error) {
        console.error('Create Request Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
