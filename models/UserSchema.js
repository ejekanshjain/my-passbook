const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    passwords: [
        {
            name: String,
            username: String,
            pass: String
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model('User', UserSchema)