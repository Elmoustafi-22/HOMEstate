import mongoose from "mongoose";

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
        default: "https://www.flaticon.com/free-icon/profile_3135715?term=profile+picture&page=1&position=1&origin=tag&related_id=3135715"
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;