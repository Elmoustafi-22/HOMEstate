import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import listingRouter from './routes/listing.route.js';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB!');   
}).catch((err) => {
    console.log(err);
});

// Define the root directory
const __dirname = path.resolve();

// Initialize Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware for parsing cookies
app.use(cookieParser());

// Start the server
app.listen(3000, () =>{
    console.log('Server is running on port 3000!');
});

// Define routes
app.use("/api/user", userRouter); // Routes for user-related operations
app.use("/api/auth", authRouter); // Routes for authentication
app.use("/api/listing", listingRouter); // Routes for listing-related operations

// Serve static files from the client/dist directory
app.use(express.static(path.join(__dirname, '/client/dist')));

// Serve the index.html file for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
