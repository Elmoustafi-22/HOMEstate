import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  // Redux state to get current user information
  const { currentUser } = useSelector((state) => state.user);
  // State variable to store the search term
  const [searchTerm, setSearchTerm] = useState('');
  // Hook to enable navigation
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    // Navigate to search page with the updated search term
    navigate(`/search?${searchQuery}`);
  };

  // Effect to update search term when URL search parameter changes
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    setSearchTerm(searchTermFromUrl || ''); // Set search term from URL or empty string
  }, []);

  return (
    <header className='bg-teal-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-5'>
        {/* Logo */}
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-teal-400'>HOME</span>
            <span className='text-teal-600'>state</span>
          </h1>
        </Link>
        {/* Search form */}
        <form onSubmit={handleSubmit} className='bg-teal-100 p-2 rounded-lg flex items-center'>
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent focus:outline-none w-24 sm:w-64'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className='text-teal-600' />
          </button>
        </form>
        {/* Navigation links */}
        <ul className='flex gap-4'>
          {/* Home link */}
          <Link to='/'>
            <li className='hidden sm:inline text-teal-700 hover:underline'>Home</li>
          </Link>
          {/* About link */}
          <Link to='/about'>
            <li className='hidden sm:inline text-teal-700 hover:underline'>About</li>
          </Link>
          {/* Profile link */}
          <Link to='/profile'>
            {currentUser ? (
              // Display user's profile picture if logged in
              <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile picture' />
            ) : (
              // Display sign in link if not logged in
              <li className='text-teal-700 hover:underline'>Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
