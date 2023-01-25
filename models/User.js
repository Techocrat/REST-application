import mongoose from 'mongoose';
import Schema from mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 12
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user']
    },
    department: {
        type: String,
        required: false
    },
    createdTime: {
        type: Date,
        default: Date.now
    },
    updatedTime: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
