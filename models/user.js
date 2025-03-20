const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['owner', 'customer'], required: true }, // User type
    phone: { type: String },
    address: { type: String },
    badgeID: { type: String }, // For owners only
    profilePhoto: { type: String } // URL to profile image
});

module.exports = mongoose.model('User', UserSchema);