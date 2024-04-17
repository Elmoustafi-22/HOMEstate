// Define a function to create custom error objects
export const errorHandler = (statusCode, message) => {
    // Create a new Error object
    const error = new Error();
    // Set the status code and message properties
    error.statusCode = statusCode;
    error.message = message;
    // Return the error object
    return error;
};
