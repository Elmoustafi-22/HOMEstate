import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { 
    getDownloadURL, 
    getStorage, 
    ref, 
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase.js';
import { 
    updateUserStart, 
    updateUserSuccess, 
    updateUserFailure,
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    signOutUserStart,
} from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
    // References to DOM elements
    const fileRef = useRef(null);
    // Select user information from Redux store
    const { currentUser, loading, error } = useSelector((state) => state.user);
    // State variables for file upload and form data
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false); 
    const [formData, setFormData] = useState({});
    // Redux dispatch function
    const dispatch = useDispatch();
    // State variables for update success and error in showing listings
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showListingsError, setShowListingsError] = useState(false);
    // State variable for user listings
    const [userListings, setUserListings] = useState([]);
    
    // Function to handle file upload
    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = (file) => {
        // Firebase storage setup
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Track upload progress and handle completion/error
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePerc(Math.round(progress));
            },
            (error) => {
                setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFormData({...formData, avatar: downloadURL});
                });
            }
        );
    };

    // Function to handle form input change
    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value});
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json()
            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                return;
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true)
        } catch (error) {
            dispatch(updateUserFailure(error.message));
        }
    }

    // Function to handle user deletion
    const handleDeleteUser = async () => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    }

    // Function to handle user sign out
    const handleSignOut = async () => {
        try {
            dispatch(signOutUserStart());
            const res = await fetch('/api/auth/signout');
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
        } catch (error) {
            dispatch(deleteUserFailure(data.message));
        }
    };

    // Function to fetch user listings
    const handleShowListings = async () => {
        try {
            setShowListingsError(false);
            const res = await fetch(`api/user/listings/${currentUser._id}`);
            const data = await res.json();
            if (data.success === false) {
                setShowListingsError(true);
                return;
            }
            setUserListings(data);
        } catch (error) {
            setShowListingsError(true);
        }
    }

    // Function to delete a user listing
    const handleListingDelete = async (listingId) => {
        try {
            const res = await fetch(`/api/listing/delete/${listingId}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
        } catch (error) {
            console.log(error.message);
        }
    };

    // JSX rendering
    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                {/* File input for profile picture */}
                <input onChange={(e) => setFile(e.target.files[0])}
                    type='file' 
                    ref={fileRef} 
                    hidden accept='image/*'
                />
                {/* Display profile picture */}
                <img 
                    onClick={() => fileRef.current.click()} 
                    src={formData.avatar || currentUser.avatar} 
                    alt='profile'
                    className='rounded-full h-24 w-24 object-cover cursor-pointer self-center ml-2'
                />
                {/* Display file upload status */}
                <p className='text-sm self-center '>
                    {fileUploadError ? (
                        <span className='text-red-700'>
                            Error Image upload (image must be less than 2 mb)
                        </span>
                    ) : filePerc > 0 && filePerc < 100 ? (
                        <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
                    ) : filePerc === 100 ? (
                        <span className='text-green-700'>Image successfully uploaded!</span>
                    ) : ('')
                    }
                </p>
                {/* Input fields for user information */}
                <input type="text" placeholder="username"
                    defaultValue={currentUser.username}
                    id="username" 
                    className="focus:outline-none border p-3 rounded-lg"
                    onChange={handleChange}
                />
                <input type="email" placeholder="email"
                    defaultValue={currentUser.email}
                    id="email" 
                    className="focus:outline-none border p-3 rounded-lg"
                    onChange={handleChange} 
                />
                <input type="password" placeholder="password"
                    id="password" 
                    className="focus:outline-none border p-3 rounded-lg"
                    onChange={handleChange} 
                />
                {/* Submit button */}
                <button className='disabled={loading} bg-teal-700 text-white rounded-lg 
                    p-3 uppercase hover:opacity-95 disabled:opacity-80'>
                    {loading ? 'Loading...': 'Update'}
                </button>
                {/* Link to create listing page */}
                <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}>
                    Create Listing
                </Link>
            </form>
            {/* Delete account and sign out buttons */}
            <div className='flex justify-between mt-5'>
                <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
                <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
            </div>
            {/* Error and success messages */}
            <p className='text-red-700 mt-5'>{error ? error : ''}</p>
            <p className='text-green-700 mt-5'>{updateSuccess ? 'User is updated successfully!' : ''}</p>
            {/* Button to show user listings */}
            <button onClick={handleShowListings} className='text-green-700 w-full'>Show Listings</button>
            {/* Error message for listing retrieval */}
            <p className='text-red-700 mt-5'>{showListingsError ? 'Error showing listings' : ''}</p>
            {/* Display user listings */}
            {userListings && userListings.length > 0 && (
                <div className='flex flex-col gap-4'>
                    <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
                    {userListings.map((listing) => (
                        <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
                            <Link to={`/listing/${listing._id}`}>
                                <img src={listing.imageUrls[0]} alt="listing cover" className='h-16 w-16 object-contain' />
                            </Link>
                            <Link className='flex-1 text-teal-700 font-semibold hover:underline truncate' to={`/listing/${listing._id}`}>
                                <p>{listing.name}</p>
                            </Link>
                            <div className='flex flex-col items-center'>
                                <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
                                <Link to={`/update-listing/${listing._id}`}>
                                    <button className='text-green-700 uppercase'>Edit</button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
