const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    firstConnections: {
        type: Array,
        default: [],
    },
    temporaryConnections: {
        type: Array,
        default: [],
    },
    healthStatus: {
        type: Boolean,
        default: false,
    },
    creationDate: {
        type: Date,
        default: Date(),
    }
});

module.exports = mongoose.model('User', userSchema);
