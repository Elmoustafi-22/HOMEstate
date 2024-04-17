// Importing necessary modules and models
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

// Controller function for creating a new listing
export const createListing = async (req, res, next) => {
    try {
        // Creating a new listing with the data from the request body
        const listing = await Listing.create(req.body);
        // Sending success response with the created listing
        return res.status(201).json(listing);
    } catch (error){
        // Forwarding any error to the error handler middleware
        next(error);
    }
};

// Controller function for deleting a listing
export const deleteListing = async (req, res, next) => {
  // Finding the listing by ID
  const listing = await Listing.findById(req.params.id);

  // If listing not found, return error
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  // If the user is not the owner of the listing, return error
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    // Deleting the listing
    await Listing.findByIdAndDelete(req.params.id);
    // Sending success response for listing deletion
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    // Forwarding any error to the error handler middleware
    next(error);
  }
};

// Controller function for updating a listing
export const updateListing = async (req, res, next) => {
  // Finding the listing by ID
  const listing = await Listing.findById(req.params.id);
  // If listing not found, return error
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  // If the user is not the owner of the listing, return error
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    // Updating the listing with the data from the request body
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    // Sending success response with the updated listing
    res.status(200).json(updatedListing);
  } catch (error) {
    // Forwarding any error to the error handler middleware
    next(error);
  }
};

// Controller function for getting a single listing by ID
export const getListing = async (req, res, next) => {
  try {
    // Finding the listing by ID
    const listing = await Listing.findById(req.params.id);
    // If listing not found, return error
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    // Sending success response with the retrieved listing
    res.status(200).json(listing);
  } catch (error) {
    // Forwarding any error to the error handler middleware
    next(error);
  }
};

// Controller function for getting a list of listings
export const getListings = async (req, res, next) => {
  try {
    // Parsing query parameters for filtering, sorting, and pagination
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    // Handling undefined or false value for offer
    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    // Handling undefined or false value for furnished
    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    // Handling undefined or false value for parking
    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    // Handling undefined or 'all' value for type
    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    // Querying listings based on filters, sorting, and pagination
    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    // Sending success response with the retrieved listings
    return res.status(200).json(listings);
  } catch (error) {
    // Forwarding any error to the error handler middleware
    next(error);
  }
};
