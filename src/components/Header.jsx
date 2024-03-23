import {FaSearch} from 'react-icons/fa';
import {Link} from 'react-router-dom';

export default function Header() {
  return (
    <header className='bg-teal-200 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-5'>
            <Link to='/'>
                <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                <span className='text-teal-400'>HOME</span>
                <span className='text-teal-600'>state</span>
                </h1>
            </Link>
            <form className='bg-teal-100 p-2 rounded-lg flex items-center'>
                <input type='text'
                placeholder='Search...'
                className='bg-transparent focus:outline-none w-24 sm:w-64'/>
                <FaSearch className='text-teal-600' />
            </form>
            <ul className='flex gap-4'>
                <Link to='/'>
                    <li className='hidden sm:inline text-teal-700 hover:underline'>Home</li>
                </Link>
                <Link to='/about'>
                    <li className='hidden sm:inline text-teal-700 hover:underline'>About</li>
                </Link>
                <Link to='/sign-in'>
                    <li className='text-teal-700 hover:underline'>Sign in</li>
                </Link>
            </ul>
        </div>
    </header>
  )
}
