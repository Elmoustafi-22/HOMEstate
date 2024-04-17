// Import the necessary modules
import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

// Define a middleware function to verify JWT token
export const verifyToken = (req, res, next) => {
    // Retrieve the JWT token from cookies
    const token = req.cookies.access_token;

    // If token is not present, return Unauthorized error
    if (!token) return next(errorHandler(401, 'Unauthorized'));

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // If verification fails, return Forbidden error
        if (err) return next(errorHandler(403, 'Forbidden'));

        // If verification succeeds, set user in request object and proceed to next middleware
        req.user = user;
        next();
    });
};
