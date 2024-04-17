import express from 'express';
import { 
  test, 
  updateUser, 
  deleteUser, 
  getUserListings, 
  getUser 
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Define routes for user operations
router.get('/test', test); // Route for testing the API
router.post('/update/:id', verifyToken, updateUser); // Route for updating user information
router.delete('/delete/:id', verifyToken, deleteUser); // Route for deleting a user account
router.get('/listings/:id', verifyToken, getUserListings); // Route for getting listings associated with a user
router.get('/:id', verifyToken, getUser); // Route for getting user information

export default router;
