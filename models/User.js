const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the user schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = User = mongoose.model('users', UserSchema);
// Export the user model