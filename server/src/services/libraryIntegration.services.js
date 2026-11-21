const axios = require('axios');

const LIBRARY_BASE_URL = process.env.LIBRARY_BASE_URL || 'http://localhost:5000';
const TIMEOUT = parseInt(process.env.INTEGRATION_TIMEOUT_MS) || 8000;

// Function to fetch book details from the Library Management System
async function fetchBookFromLibrary(bookId) {
    try {
        const response = await axios.get(`${LIBRARY_BASE_URL}/api/v1/books/${bookId}`, {
            timeout: TIMEOUT
        });
        
        // Depending on the Library API response structure, we can return the data directly or map it to our inventory format.
        if (response.data) {
            return response.data;
        }
        
        throw new Error("Failed to fetch book from Library.");
    } catch (error) {
        console.error("Library API Error:", error.message);
        throw {
            status: error.response?.status || 500,
            title: "Library Integration Error",
            detail: error.response?.data?.message || `Failed to connect to Library System at ${LIBRARY_BASE_URL}`
        };
    }
}

module.exports = { fetchBookFromLibrary };