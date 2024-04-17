import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";

// This function defines the main component of the application
export default function App() {
  // Render the application using React Router and components
  return (
    <BrowserRouter>
      {/* Display the header component */}
      <Header />
      <Routes>
        {/* Define routes for different pages */}
        <Route path="/" element={<Home />} /> {/* Route for the home page */}
        <Route path="/sign-in" element={<SignIn />} /> {/* Route for the sign-in page */}
        <Route path="/sign-up" element={<SignUp />} /> {/* Route for the sign-up page */}
        <Route path="/about" element={<About />} /> {/* Route for the about page */}
        <Route path="/search" element={<Search />} /> {/* Route for the search page */}
        <Route path="/listing/:listingId" element={<Listing />} /> {/* Route for individual listings */}
        {/* Private routes, accessible only after authentication */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} /> {/* Route for the profile page */}
          <Route path="/create-listing" element={<CreateListing />} /> {/* Route for creating a new listing */}
          <Route path="/update-listing/:listingId" element={<UpdateListing />} /> {/* Route for updating a listing */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
