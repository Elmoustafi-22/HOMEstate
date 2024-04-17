// Import necessary modules from React, Firebase, Redux, and React Router DOM
import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Define the CreateListing function component
export default function CreateListing() {
  // State management using useState hook
  const { currentUser } = useSelector((state) => state.user); // Get current user from Redux store
  const navigate = useNavigate(); // Access navigation function from React Router
  const [files, setFiles] = useState([]); // State for managing uploaded files
  const [formData, setFormData] = useState({ // State for managing form data
    imageUrls: [], // Array to store image URLs
    name: '', // Listing name
    description: '', // Listing description
    address: '', // Listing address
    type: 'rent', // Listing type (default: rent)
    bedrooms: 1, // Number of bedrooms (default: 1)
    bathrooms: 1, // Number of bathrooms (default: 1)
    regularPrice: 50, // Regular price (default: $50)
    discountPrice: 0, // Discounted price (default: $0)
    offer: false, // Offer status (default: false)
    parking: false, // Parking availability (default: false)
    furnished: false, // Furnishing status (default: false)
  });
  const [imageUploadError, setImageUploadError] = useState(false); // State for managing image upload errors
  const [uploading, setUploading] = useState(false); // State for tracking upload status
  const [error, setError] = useState(false); // State for managing general errors
  const [loading, setLoading] = useState(false); // State for tracking loading status

  // Function to handle image submission
  const handleImageSubmit = (e) => {
    // Check if files are selected and within upload limit
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true); // Set uploading status to true
      setImageUploadError(false); // Clear previous upload errors
      const promises = [];

      // Upload each file to storage
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i])); // Push promise to array
      }
      
      // Handle promises after all uploads are completed
      Promise.all(promises)
        .then((urls) => {
          // Concatenate new image URLs with existing ones
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false); // Clear upload error
          setUploading(false); // Reset uploading status
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)'); // Set upload error
          setUploading(false); // Reset uploading status
        });
    } else {
      // Display error if upload limit is exceeded
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false); // Reset uploading status
    }
  };

  // Function to upload image to Firebase storage
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app); // Get Firebase storage reference
      const fileName = new Date().getTime() + file.name; // Generate unique file name
      const storageRef = ref(storage, fileName); // Create storage reference
      const uploadTask = uploadBytesResumable(storageRef, file); // Upload file to storage

      // Track upload progress and completion
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // Calculate upload progress
          console.log(`Upload is ${progress}% done`); // Log upload progress
        },
        (error) => {
          reject(error); // Reject promise if error occurs
        },
        () => {
          // Resolve promise with download URL upon successful upload
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL); // Resolve promise with download URL
          });
        }
      );
    });
  };

  // Function to remove image from form data
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index), // Filter out image at specified index
    });
  };

  // Function to handle form input changes
  const handleChange = (e) => {
    // Update form data based on input type and ID
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id, // Update listing type
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked, // Update checkbox values
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value, // Update input field values
      });
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Validate form data before submission
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image'); // Display error if no images uploaded
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price'); // Display error if discount price is higher than regular price
      
      setLoading(true); // Set loading status to true
      setError(false); // Clear previous errors

      // Send form data to server for processing
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id, // Pass user ID with form data
        }),
      });
      
      const data = await res.json(); // Parse response data
      
      setLoading(false); // Reset loading status
      
      // Handle response data
      if (data.success === false) {
        setError(data.message); // Display error message if request failed
      }
      
      navigate(`/listing/${data._id}`); // Redirect to created listing
    } catch (error) {
      setError(error.message); // Display error if request fails
      setLoading(false); // Reset loading status
    }
  };

  // Render the form for creating a listing
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        {/* Form inputs for listing details */}
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />
          {/* Checkboxes for listing attributes */}
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'sale'}
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          {/* Input fields for bedrooms, bathrooms, and prices */}
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='50'
                max='10000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                {/* Display price unit for rental listings */}
                {formData.type === 'rent' && (
                  <span className='text-xs'>($ / month)</span>
                )}
              </div>
            </div>
            {/* Display discounted price field if offer is selected */}
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  max='10000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>Discounted price</p>
                  {/* Display price unit for rental listings */}
                  {formData.type === 'rent' && (
                    <span className='text-xs'>($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Section for managing images */}
        <div className='flex flex-col flex-1 gap-4'>
          {/* Image upload input */}
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            {/* Button to trigger image upload */}
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          {/* Display image upload error */}
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {/* Display uploaded images with option to delete */}
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                {/* Button to remove image */}
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
          {/* Button to submit listing */}
          <button
            disabled={loading || uploading}
            className='p-3 bg-teal-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Creating...' : 'Create listing'}
          </button>
          {/* Display general form submission error */}
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}
