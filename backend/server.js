const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { Club, Sport, Culture, Organizer, ScoreLog } = require('./models');

const app = express();

const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());
app.enable('trust proxy'); // Trust Cloudflare proxy for SSL

// Serve static frontend files (root directory of project)
app.use(express.static(path.join(__dirname, '../')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// ===================== AUTHENTICATION =====================

// Register Organizer
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if organizer exists
        let organizer = await Organizer.findOne({ email });
        if (organizer) {
            return res.status(400).json({ message: 'Organizer already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create organizer
        organizer = new Organizer({
            name,
            email,
            password: hashedPassword
        });

        await organizer.save();

        // Create JWT token
        const token = jwt.sign({ id: organizer._id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.json({
            token,
            organizer: {
                id: organizer._id,
                name: organizer.name,
                email: organizer.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login Organizer
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if organizer exists
        const organizer = await Organizer.findOne({ email });
        if (!organizer) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, organizer.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign({ id: organizer._id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.json({
            token,
            organizer: {
                id: organizer._id,
                name: organizer.name,
                email: organizer.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.organizerId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// ===================== CLUB ENDPOINTS =====================

// Get all clubs
app.get('/api/clubs', async (req, res) => {
    try {
        const clubs = await Club.find().sort({ totalPoints: -1 });
        res.json(clubs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add points to a specific sport
app.post('/api/clubs/:clubId/add-sport-points', verifyToken, async (req, res) => {
    try {
        const { clubId } = req.params;
        const { sport, gender, points } = req.body;

        if (!sport || !gender || !points) {
            return res.status(400).json({ message: 'Sport name, gender, and points are required' });
        }

        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        // Update or create sport breakdown entry by sport AND gender
        let sportEntry = club.sportBreakdown.find(s => s.sport === sport && s.gender === gender);
        if (sportEntry) {
            sportEntry.points += points;
        } else {
            club.sportBreakdown.push({ sport, gender, points });
        }

        // Update total points
        club.sportsPoints += points;
        club.totalPoints += points;
        await club.save();

        // Log the update
        const organizer = await Organizer.findById(req.organizerId);
        await ScoreLog.create({
            club: club.name,
            eventType: 'sports',
            eventName: sport,
            gender: gender,
            pointsAdded: points,
            updatedBy: organizer.name
        });

        res.json({
            message: `${sport} (${gender}) points added to ${club.name}`,
            club
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add points to a specific culture event
app.post('/api/clubs/:clubId/add-culture-points', verifyToken, async (req, res) => {
    try {
        const { clubId } = req.params;
        const { event, points } = req.body;

        if (!event || !points) {
            return res.status(400).json({ message: 'Event name and points are required' });
        }

        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        // Update or create culture breakdown entry
        let eventEntry = club.cultureBreakdown.find(e => e.event === event);
        if (eventEntry) {
            eventEntry.points += points;
        } else {
            club.cultureBreakdown.push({ event, points });
        }

        // Update total points
        club.culturePoints += points;
        club.totalPoints += points;
        await club.save();

        // Log the update
        const organizer = await Organizer.findById(req.organizerId);
        await ScoreLog.create({
            club: club.name,
            eventType: 'culture',
            eventName: event,
            pointsAdded: points,
            updatedBy: organizer.name
        });

        res.json({
            message: `${event} points added to ${club.name}`,
            club
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get club with breakdown (shows all individual sport/event scores)
app.get('/api/clubs/:clubId/breakdown', async (req, res) => {
    try {
        const { clubId } = req.params;
        const club = await Club.findById(clubId);

        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        res.json({
            name: club.name,
            totalPoints: club.totalPoints,
            sportsPoints: club.sportsPoints,
            culturePoints: club.culturePoints,
            sportBreakdown: club.sportBreakdown,
            cultureBreakdown: club.cultureBreakdown
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ===================== SPORT EVENT ENDPOINTS =====================

// Get all sports
app.get('/api/sports', async (req, res) => {
    try {
        const sports = await Sport.find();
        res.json(sports);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update sport standings
app.post('/api/sports/:sportId/update-standings', verifyToken, async (req, res) => {
    try {
        const { sportId } = req.params;
        const { standings } = req.body;

        const sport = await Sport.findByIdAndUpdate(
            sportId,
            { standings },
            { new: true }
        );

        res.json({
            message: 'Sport standings updated',
            sport
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ===================== CULTURE EVENT ENDPOINTS =====================

// Get all culture events
app.get('/api/culture', async (req, res) => {
    try {
        const culture = await Culture.find();
        res.json(culture);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update culture event standings
app.post('/api/culture/:cultureId/update-standings', verifyToken, async (req, res) => {
    try {
        const { cultureId } = req.params;
        const { standings } = req.body;

        const culture = await Culture.findByIdAndUpdate(
            cultureId,
            { standings },
            { new: true }
        );

        res.json({
            message: 'Culture standings updated',
            culture
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ===================== SCORE LOG ENDPOINTS =====================

// Get score update logs
app.get('/api/score-logs', verifyToken, async (req, res) => {
    try {
        const logs = await ScoreLog.find().sort({ timestamp: -1 }).limit(50);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ===================== INIT DATA ENDPOINTS =====================

// Initialize clubs from frontend data
app.post('/api/init-clubs', async (req, res) => {
    try {
        // Check if clubs already exist
        const existingClubs = await Club.find();
        if (existingClubs.length > 0) {
            return res.json({ message: 'Clubs already initialized' });
        }

        const clubsData = req.body.clubs;
        const clubs = await Club.insertMany(clubsData);

        res.json({
            message: 'Clubs initialized',
            clubs
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Fallback for frontend routing (if any)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Start server
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
