import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle'; // Import the CSS styles for the Swiper bundle
import ListingItem from '../components/ListingItem';

// Define the Home component
export default function Home() {
    // Define state variables to store listings data
    const [offerListings, setOfferListings] = useState([]);
    const [saleListings, setSaleListings] = useState([]);
    const [rentListings, setRentListings] = useState([]);

    // Initialize Swiper core modules
    SwiperCore.use([Navigation]);

    // Fetch data when the component mounts
    useEffect(() => {
        // Function to fetch offer listings
        const fetchOfferListings = async () => {
            try {
                const res = await fetch('/api/listing/get?offer=true&limit=4');
                const data = await res.json();
                setOfferListings(data);
                fetchRentListings(); // Fetch rent listings after setting offer listings
            } catch (error) {
                console.log(error);
            }
        };

        // Function to fetch sale listings
        const fetchSaleListings = async () => {
            try {
                const res = await fetch('/api/listing/get?type=sale&limit=4');
                const data = await res.json();
                setSaleListings(data);
            } catch (error) {
                console.log(error);
            }
        };

        // Function to fetch rent listings
        const fetchRentListings = async () => {
            try {
                const res = await fetch('/api/listing/get?type=rent&limit=4');
                const data = await res.json();
                setRentListings(data);
                fetchSaleListings(); // Fetch sale listings after setting rent listings
            } catch (error) {
                console.log(error);
            }
        };

        // Call the function to fetch offer listings when the component mounts
        fetchOfferListings();
    }, []); // Empty dependency array to run the effect only once when the component mounts

    // Render the Home component JSX
    return (
        <div>
            {/* Top section */}
            <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
                <h1 className='text-teal-700 font-bold text-3xl lg:text-6xl'>
                    Discover your dream <span className='text-teal-500'>home</span> 
                    <br />
                    with us
                </h1>
                <div className='text-teal-400 text-xs sm:text-sm'>
                    HOMEstate-a place where every property is a doorway to a lifetime of memories.
                    <br />
                </div>
                <Link to={"/search"} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
                    Let's start now...
                </Link>
            </div>

            {/* Swiper */}
            <Swiper navigation>
                {/* Map through offer listings and render each as a SwiperSlide */}
                {offerListings && offerListings.length > 0 && 
                offerListings.map((listing) => (
                    <SwiperSlide key={listing._id}>
                        <div style={{ background: `url(${listing.imageUrls[0]}) center no-repeat`, 
                            backgroundSize: 'cover', }}
                            className='h-[500px]' key={listing._id}>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Listing results for offer, sales, and rent */}
            <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
                {/* Render recent offer listings if available */}
                {offerListings && offerListings.length > 0 && (
                    <div className=''>    
                        <div className='my-3 '>
                            <div>
                                <h2 className='text-2xl font-semibold text-teal-600'>Recent offers</h2>
                                <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>
                                    Show more offers
                                </Link>
                            </div>
                            <div className='flex flex-wrap gap-4'>
                                {/* Map through offer listings and render each as a ListingItem */}
                                {offerListings.map((listing) => (
                                    <ListingItem listing={listing} key={listing._id} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Render recent rent listings if available */}
                {rentListings && rentListings.length > 0 && (
                    <div className=''>
                        <div className='my-3 '>
                            <div>
                                <h2 className='text-2xl font-semibold text-teal-600'>Recent places for rent</h2>
                                <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>
                                    Show more places for rent
                                </Link>
                            </div>
                            <div className='flex flex-wrap gap-4'>
                                {/* Map through rent listings and render each as a ListingItem */}
                                {rentListings.map((listing) => (
                                    <ListingItem listing={listing} key={listing._id} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Render recent sale listings if available */}
                {saleListings && saleListings.length > 0 && (
                    <div className=''> 
                        <div className='my-3 '>
                            <div>
                                <h2 className='text-2xl font-semibold text-teal-600'>Recent places for sale</h2>
                                <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>
                                    Show more places for sale
                                </Link>
                            </div>
                            <div className='flex flex-wrap gap-4'>
                                {/* Map through sale listings and render each as a ListingItem */}
                                {saleListings.map((listing) => (
                                    <ListingItem listing={listing} key={listing._id} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
