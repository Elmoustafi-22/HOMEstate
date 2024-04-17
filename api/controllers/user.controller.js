// Importing necessary modules and models
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import Listing from '../models/listing.model.js';

// Test API route
export const test = (req, res) => {
    // Sending a test response
    res.json({
        message: "Api route is working!",
    });
}

// Controller function for updating user information
export const updateUser = async (req, res, next) => {
    // Checking if the authenticated user is updating their own account
    if(req.user.id !== req.params.id) return next(errorHandler(401, "You can only update your account!")) 
    try {
        // Hashing the password if it is included in the request body
        if(req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }

        // Updating user information in the database
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            },
        }, 
        {new: true})

        // Removing password from the user object in the response
        const { password, ...rest } = updatedUser._doc;

        // Sending success response with the updated user information
        res.status(200).json(rest);
    } catch (error) {
        // Forwarding any error to the error handler middleware
        next(error);
    }
};

// Controller function for deleting a user account
export const deleteUser = async (req, res, next) => {
    // Checking if the authenticated user is deleting their own account
    if(req.user.id !== req.params.id) return next(errorHandler(401, 'You can only delete your own account!'));
    try {
        // Deleting the user account from the database
        await User.findByIdAndDelete(req.params.id)
        // Clearing access token cookie
        res.clearCookie('access_token');
        // Sending success response for account deletion
        res.status(200).json('User has been deleted!');
    } catch (error) {
        // Forwarding any error to the error handler middleware
        next(error)
    }
};

// Controller function for retrieving listings created by a user
export const getUserListings = async (req, res, next) => {
    // Checking if the authenticated user is requesting their own listings
    if(req.user.id === req.params.id){
        try {
            // Finding listings associated with the user
            const listings = await Listing.find({ userRef: req.params.id });
            // Sending success response with the retrieved listings
            res.status(200).json(listings);
        } catch (error) {
            // Forwarding any error to the error handler middleware
            next(error);
        }
    } else {
        // If the user is not authorized to view the listings, return error
        return next(errorHandler(401, 'You can only view your listing!'));
    }
}

// Controller function for retrieving user information
export const getUser = async (req, res, next) => {
  try {
    // Finding user by ID
    const user = await User.findById(req.params.id);
  
    // If user not found, return error
    if (!user) return next(errorHandler(404, 'User not found!'));
  
    // Removing password from the user object in the response
    const { password: pass, ...rest } = user._doc;
  
    // Sending success response with the retrieved user information
    res.status(200).json(rest);
  } catch (error) {
    // Forwarding any error to the error handler middleware
    next(error);
  }
};
