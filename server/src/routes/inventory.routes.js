const express = require('express');
const router = express.Router();
const { fetchBookFromLibrary } = require('../services/libraryIntegration.service');

// Inventory route to fetch book details from Library Management System
router.get('/api/v1/inventory/library-books/:bookId', async (req, res) => {
    try {
        const bookId = req.params.bookId;
        
        // 1. Call the Library Integration Service to fetch book details
        const libraryBook = await fetchBookFromLibrary(bookId);
        
        // 2. Return the fetched book details to the frontend
        res.status(200).json({
            status: "success",
            message: "Successfully fetched book from Library.",
            inventoryItem: {
                itemCode: libraryBook.bookId,
                itemName: libraryBook.title,
                source: "Library Management System"
            }
        });
    } catch (error) {
        // RFC 7807 Problem Details Response
        res.status(error.status || 500).json({
            type: "about:blank",
            title: error.title || "Integration Error",
            status: error.status || 500,
            detail: error.detail,
            instance: req.originalUrl
        });
    }
});

module.exports = router;