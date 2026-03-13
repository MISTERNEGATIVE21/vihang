const mongoose = require('mongoose');
const { mainDb, imageDb} = require('./db');

// Club Schema
const clubSchema = new mongoose.Schema({
    name: { type: String, required: true },
    theme: { type: String, required: true },
    color: { type: String, required: true },
    totalPoints: { type: Number, default: 0 },
    sportsPoints: { type: Number, default: 0 },
    culturePoints: { type: Number, default: 0 },

    // Individual Sport Scores
    sportBreakdown: [{
        sport: { type: String, required: true },
        gender: { type: String, enum: ['male', 'female', 'mixed', 'neutral'], required: true },
        points: { type: Number, default: 0 }
    }],

    // Individual Culture Event Scores
    cultureBreakdown: [{
        event: { type: String, required: true },
        points: { type: Number, default: 0 }
    }],

    createdAt: { type: Date, default: Date.now }
});

// Sport Event Schema
const sportSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String },
    standings: [{
        rank: Number,
        club: String,
        points: Number
    }],
    createdAt: { type: Date, default: Date.now }
});

// Culture Event Schema
const cultureSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String },
    standings: [{
        rank: Number,
        club: String,
        points: Number
    }],
    createdAt: { type: Date, default: Date.now }
});

// Organizer Schema
const organizerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'organizer' },
    canUpdateScores: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Score Update Log Schema
const scoreLogSchema = new mongoose.Schema({
    club: { type: String, required: true },
    eventType: { type: String, enum: ['sports', 'culture'], required: true },
    eventName: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female', 'mixed', 'neutral'] }, // Optional, only for sports
    pointsAdded: { type: Number, required: true },
    updatedBy: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

// ===================== IMAGE DB SCHEMAS =====================
const clubHomeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image_url: { type: String, required: true }
}, { collection: 'Clubs-home' });

const GallerySchema = new mongoose.Schema({
    num: { type: mongoose.Schema.Types.Decimal128, required: true },
    image_url: { type: String, required: true }
}, { collection: 'Gallery' });

const clubLogosSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image_url: { type: String, required: true }
}, { collection: 'Club-logos' });

const teamPageSchema = new mongoose.Schema({
    category: { type: String, required: true },
    Name: { type: String, required: true },
    image_url: { type: String, required: true }
}, { collection: 'Teampage' });

module.exports = {
    Club: mainDb.model('Club', clubSchema),
    Sport: mainDb.model('Sport', sportSchema),
    Culture: mainDb.model('Culture', cultureSchema),
    Organizer: mainDb.model('Organizer', organizerSchema),
    ScoreLog: mainDb.model('ScoreLog', scoreLogSchema),
    ClubHome: imageDb.model('ClubHome', clubHomeSchema),
    Gallery: imageDb.model('Gallery', GallerySchema),
    ClubLogo: imageDb.model('ClubLogo', clubLogosSchema),
    TeamMember: imageDb.model('TeamMember', teamPageSchema)
};
