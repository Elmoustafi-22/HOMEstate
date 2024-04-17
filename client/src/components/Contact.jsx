import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  // State variables to store landlord information and message
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  // Function to update the message state
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  // Effect to fetch landlord information when component mounts or listing changes
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
      {/* Display contact form if landlord information is available */}
      {landlord && (
        <div className='flex flex-col gap-2'>
          {/* Display landlord's username and listing name */}
          <p>
            Contact <span className='font-semibold'>{landlord.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          {/* Textarea for entering message */}
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg'
          ></textarea>
          {/* Link to compose email with pre-filled subject and body */}
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className='bg-teal-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
