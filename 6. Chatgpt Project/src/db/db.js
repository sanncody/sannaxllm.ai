const mongoose = require('mongoose');

function connectDB() {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('Connected to DB successfully✅');
        })
        .catch(err => {
            console.log('Error connecting to DB❌', err);
        })
}

module.exports = connectDB;