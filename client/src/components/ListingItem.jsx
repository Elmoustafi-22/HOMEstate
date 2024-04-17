// Importing necessary dependencies from React Router and React Icons
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

// Functional component for rendering a single listing item
export default function ListingItem({ listing }) {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[300px]'>
      {/* Link to the individual listing page */}
      <Link to={`/listing/${listing._id}`}>
        {/* Image of the listing */}
        <img
          src={listing.imageUrls[0] || "https://img.freepik.com/free-photo/villa-house-model-key-drawing-retro-desktop-real-estate-sale-concept_1387-410.jpg"}
          alt="listing cover"
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
        {/* Details of the listing */}
        <div className="p-3 flex flex-col gap-2 w-full">
          {/* Listing name */}
          <p className='text-lg font-semibold text-teal-700 truncate'>{listing.name}</p>
          {/* Location */}
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-teal-700' />
            <p className='text-sm text-gray-600 truncate w-full'>{listing.address}</p>
          </div>
          {/* Description */}
          <p className='text-sm text-gray-600 line-clamp-2'>{listing.description}</p>
          {/* Price */}
          <p className='text-teal-500 mt-2 font-semibold'>
            ${listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}
          </p>
          {/* Number of bedrooms and bathrooms */}
          <div className='text-teal-700 flex gap-2'>
            <div className='font-semibold text-xs'>
              {/* Display number of bedrooms */}
              {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
            </div>
            <div className='font-semibold text-xs'>
              {/* Display number of bathrooms */}
              {listing.bathrooms > 1 ? `${listing.bathrooms} bathrooms` : `${listing.bathrooms} bathroom`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
