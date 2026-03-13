const mongoose = require('mongoose');
require('dotenv').config();

// Main DB connection
const mainDb = mongoose.createConnection(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mainDb.on('connected', () => console.log('Main MongoDB connected'));
mainDb.on('error', (err) => console.log('Main DB connection error:', err));

// Images DB connection
const imageDb = mongoose.createConnection(process.env.MONGODB_IMAGE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
imageDb.on('connected', () => console.log('Images MongoDB connected'));
imageDb.on('error', (err) => console.log('Images DB connection error:', err));



module.exports = { mainDb, imageDb};