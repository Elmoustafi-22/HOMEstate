import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice.js';
import OAuth from '../components/OAuth.jsx';

// Define the SignIn component
export default function SignIn() {
  // Define state variables
  const [ formData, setFormData ] = useState();
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Function to handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Dispatch action to start sign-in process
      dispatch(signInStart());
      // Send sign-in request to the server
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      // Check if sign-in was successful
      if(data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      // Dispatch action on successful sign-in
      dispatch(signInSuccess(data));
      // Navigate to home page
      navigate('/');
    } catch (error) {
      // Dispatch action on sign-in failure
      dispatch(signInFailure(error.message));
    }  
  };

  // Render the SignIn component JSX
  return (
    <div className='p-3 max-w-lg mx-auto '>
      <h1 className='text-3xl text-center font-semibold my-7 text-teal-900'>Sign In</h1>
      {/* Sign-in form */}
      <form onSubmit={ handleSubmit } className='flex flex-col  gap-4'>
        <input 
          type="text" 
          placeholder="email"
          className="border p-3 rounded-lg" 
          id="email" 
          onChange={handleChange}
        />
        <input 
          type="password" 
          placeholder="password"
          className="border p-3 rounded-lg" 
          id="password" 
          onChange={handleChange}
        />
        <button 
          disabled={loading} 
          className='bg-teal-700 text-teal-200 p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-95'>
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        {/* OAuth component for social sign-in */}
        <OAuth />
      </form>
      {/* Link to sign-up page */}
      <div className='flex gap-2 mt-5'>
        <p className='text-teal-900'>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {/* Display error message if sign-in fails */}
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}
