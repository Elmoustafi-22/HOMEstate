import express from 'express';
import { google, signOut, signin, signup } from '../controllers/auth.controller.js';

const router = express.Router();

// Define routes for user authentication
router.post("/signup", signup); // Route for user signup
router.post("/signin", signin); // Route for user signin
router.post("/google", google); // Route for Google authentication
router.get('/signout', signOut); // Route for user signout

export default router;
