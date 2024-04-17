import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle'; // Importing CSS styles for Swiper
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';

// Component for displaying a listing details
export default function Listing() {
  SwiperCore.use([Navigation]); // Initialize Swiper navigation
  const [listing, setListing] = useState(null); // State for storing listing data
  const [loading, setLoading] = useState(false); // State for loading status
  const [error, setError] = useState(false); // State for error status
  const [copied, setCopied] = useState(false); // State for tracking if link is copied
  const [contact, setContact] = useState(false); // State for tracking contact form display
  const params = useParams(); // Get URL parameters
  const { currentUser } = useSelector((state) => state.user); // Get current user from Redux store

  // Fetch listing data from API when component mounts or URL parameters change
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true); // Set loading state to true
        const res = await fetch(`/api/listing/get/${params.listingId}`); // Fetch listing data from API
        const data = await res.json(); // Parse JSON response
        if (data.success === false) {
          // If API call is unsuccessful
          setError(true); // Set error state to true
          setLoading(false); // Set loading state to false
          return;
        }
        setListing(data); // Set listing data state
        setLoading(false); // Set loading state to false
        setError(false); // Set error state to false
      } catch (error) {
        // If an error occurs during the fetch
        setError(true); // Set error state to true
        setLoading(false); // Set loading state to false
      }
    };
    fetchListing(); // Call fetchListing function
  }, [params.listingId]); // Depend on params.listingId to refetch listing data when URL changes

  return (
    <main>
      {/* Display loading message if data is being fetched */}
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {/* Display error message if an error occurs */}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {/* Render listing details if data is available and no loading/error */}
      {listing && !loading && !error && (
        <div>
          {/* Swiper component for displaying listing images */}
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Button to copy listing link */}
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-teal-100 cursor-pointer'>
            <FaShare
              className='text-teal-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href); // Copy current URL to clipboard
                setCopied(true); // Set copied state to true
                setTimeout(() => {
                  setCopied(false); // Reset copied state after 2 seconds
                }, 2000);
              }}
            />
          </div>
          {/* Display confirmation message when link is copied */}
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-teal-100 p-2'>
              Link copied!
            </p>
          )}
          {/* Display listing details */}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            {/* Listing title and price */}
            <p className='text-2xl font-semibold'>
              {listing.name} - ${' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            {/* Listing address */}
            <p className='flex items-center mt-6 gap-2 text-teal-600 text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            {/* Listing type and discount information */}
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ${+listing.regularPrice - +listing.discountPrice} DISCOUNT
                </p>
              )}
            </div>
            {/* Listing description */}
            <p className='text-teal-800'>
              <span className='font-semibold text-black'>Description - </span>
              {listing.description}
            </p>
            {/* Listing details such as bedrooms, bathrooms, parking, and furnishing */}
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li> 
            </ul>
            {/* Display contact button if user is authenticated and not the owner */}
            {currentUser && listing.userRef !== 
             currentUser._id && !contact && (
              <button onClick={() => setContact(true)} className='bg-teal-700 text-white
              rounded-lg p-3 uppercase hover:opacity-95'>
              Contact Landlord
            </button>
            ) }
            {/* Display contact form if contact button is clicked */}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
