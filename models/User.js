const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
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
    invitedBy: {
        type: String,
        required: true
    },
    couponCode: {
        type: String,
        required: true
    },
    couponCodeEnabled: {
        type: Boolean,
        required: true
    },
    subscriptionId: {
        type: String,
        required: true
    },
    balanceInCents: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;