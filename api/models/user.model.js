import mongoose from "mongoose";

// Define the schema for a user
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://www.flaticon.com/free-icon/profile_3135715?term=profile+picture&page=1&position=1&origin=tag&related_id=3135715" // Default avatar image URL
    },
}, { timestamps: true }); // Enable timestamps to track creation and update times

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

export default User;
