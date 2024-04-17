import React from 'react';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

// Component for handling Google OAuth sign-in
export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to handle Google sign-in button click
  const handleGoogleClick = async () => {
    try {
      // Initialize GoogleAuthProvider
      const provider = new GoogleAuthProvider();
      // Get authentication instance from Firebase app
      const auth = getAuth(app);
      // Sign in with Google pop-up
      const result = await signInWithPopup(auth, provider);
      
      // Send user data to backend for authentication
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: result.user.displayName, email: result.user.email, photo: result.user.photoURL }),
      });
      // Extract response data
      const data = await res.json();
      // Dispatch action to update Redux store with user data
      dispatch(signInSuccess(data));
      // Navigate to home page after successful sign-in
      navigate('/');
    } catch (error) {
      // Log error if sign-in fails
      console.log('Could not sign in with Google', error);
    }
  };

  // Render Google sign-in button
  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
    >
      Continue with Google
    </button>
  );
}
