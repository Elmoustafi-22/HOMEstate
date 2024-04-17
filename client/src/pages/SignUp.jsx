import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import OAuth from '../components/OAuth';

// Define the SignUp component
export default function SignUp() {
  // Define state variables
  const [formData, setFormData] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      // Set loading state to true
      setLoading(true);
      // Send sign-up request to the server
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      // Check if sign-up was successful
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      // Reset loading state and error message
      setLoading(false);
      setError(null);
      // Navigate to sign-in page
      navigate('/sign-in');
    } catch (error) {
      // Reset loading state and set error message
      setLoading(false);
      setError(error.message);
    }
  };

  // Render the SignUp component JSX
  return (
    <div className='p-3 max-w-lg mx-auto '>
      <h1 className='text-3xl text-center font-semibold my-7 text-teal-900'>Sign Up</h1>
      {/* Sign-up form */}
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input 
          type="text" 
          placeholder="username"
          className="border p-3 rounded-lg" 
          id="username" 
          onChange={handleChange}
        />
        <input 
          type="text" 
          placeholder="email"
          className="border p-3 rounded-lg" 
          id="email" 
          onChange={handleChange}
        />
        <input 
          type="text" 
          placeholder="password"
          className="border p-3 rounded-lg" 
          id="password" 
          onChange={handleChange}
        />
        <button 
          disabled={loading} 
          className='bg-teal-700 text-teal-200 p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-95'>
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        {/* OAuth component for social sign-up */}
        <OAuth />
      </form>
      {/* Link to sign-in page */}
      <div className='flex gap-2 mt-5'>
        <p className='text-teal-900'>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
      {/* Display error message if sign-up fails */}
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}
