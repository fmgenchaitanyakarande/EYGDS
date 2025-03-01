const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// This will export the model so you can use it in your server.js
module.exports = mongoose.model('User', UserSchema);