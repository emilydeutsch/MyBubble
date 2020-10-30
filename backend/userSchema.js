const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    firstConnections: {
        type: Array,
        default: [],
    },
    temporaryConnections: {
        type: Array,
        default: [],
    },
    healthStatus: {
        type: Number,
        default: 4,
    },
    healthStatusOnLastCheck: {
        type: Number,
        default: 4,
    },
    creationDate: {
        type: Date,
        default: Date(),
    },
});

module.exports = mongoose.model('User', userSchema);
