const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB successfully✅');
    } catch (error) {
        console.log('Error connecting to DB❌', error);
    }
}

module.exports = connectDB;