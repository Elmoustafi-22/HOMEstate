import express from 'express';
import { 
  createListing, 
  deleteListing, 
  updateListing, 
  getListing, 
  getListings 
} from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Define routes for listing operations
router.post('/create', verifyToken, createListing); // Route for creating a new listing
router.delete('/delete/:id', verifyToken, deleteListing); // Route for deleting a listing
router.post('/update/:id', verifyToken, updateListing); // Route for updating a listing
router.get('/get/:id', getListing); // Route for getting a specific listing by ID
router.get('/get', getListings); // Route for getting multiple listings

export default router;
