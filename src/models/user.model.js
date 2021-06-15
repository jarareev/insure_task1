const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        firstname: {
            type: String,
        },
        dob: {
            type: String,
        },
        phonenumber: {
            type: String,
        },
        address: {
            type: String,
        },
        state: {
            type: String,
        },
        zip_code: {
            type: String,
        },
        email: {
            type: String,
        },
        gender: {
            type: String,
        },
        userType: {
            type: String,
        }
    },
    {
        collection: "user"
    }
)

const User = mongoose.model('user', userSchema);

module.exports = User;