// Importing necessary modules and models
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

// Controller function for user signup
export const signup = async (req, res, next) => {
    // Extracting user data from request body
    const { username, email, password } = req.body;
    // Hashing the password using bcryptjs
    const hashedPassword = bcryptjs.hashSync(password, 10);
    // Creating a new user instance with hashed password
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        // Saving the new user to the database
        await newUser.save();
        // Sending success response if user creation is successful
        res.status(201).json("User created successfully!");
    } catch (error) {
        // Forwarding any error to the error handler middleware
        next(error);
    }
};

// Controller function for user signin
export const signin = async (req, res, next) => {
    // Extracting user credentials from request body
    const { email, password } = req.body;

    try {
        // Finding the user by email
        const validUser = await User.findOne({ email });
        // If user not found, return error
        if (!validUser) return next(errorHandler(404, 'User not found!'));
        // Comparing entered password with stored password hash
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        // If password is invalid, return error
        if (!validPassword) return next(errorHandler(401, 'Wrong credentials'));
        // Generating JWT token for authentication
        const token = jwt.sign({ id: validUser._id}, process.env.JWT_SECRET);
        // Omitting password from user data before sending response
        const  { password: pass, ...rest } = validUser._doc;
        // Setting JWT token in cookie and sending user data in response
        res
            .cookie('access_token', token, { httpOnly: true})
            .status(200)
            .json(rest);
    } catch (error) {
        // Forwarding any error to the error handler middleware
        next(error);
    }
};

// Controller function for Google authentication
export const google = async (req, res, next) => {
    try {
        // Finding user by email in the database
        const user = await User.findOne({email: req.body.email})
        if (user){
            // If user exists, generate JWT token and send user data in response
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc;
            res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest);
        } else {
            // If user does not exist, generate a random password and save new user
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({username: req.body.name.split(" ").join("").toLowerCase() + Math.random().
            toString(36).slice(-4), email: req.body.email, password: hashedPassword, avatar: req.body.photo});
            await newUser.save();
            // Generate JWT token for new user and send user data in response
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest);
        }
    } catch (error) {
        // Forwarding any error to the error handler middleware
        next(error);
    }
}

// Controller function for user sign out
export const signOut = async (req, res, next) => {
    try {
        // Clearing the access token cookie
        res.clearCookie('access_token');
        // Sending success response for user logout
        res.status(200).json('User has been logged out!');
    } catch (error) {
        // Forwarding any error to the error handler middleware
        next(error); 
    }
}
