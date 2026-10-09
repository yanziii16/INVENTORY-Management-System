const express = require('express');
const router = express.Router();
const itemService = require('../services/item.service');
const { authenticateToken } = require('../middleware/auth.middleware');

// Example: The creation and deletion of items are protected.
router.get('/', itemService.getAll); //Public or Protected, depending on your specs.
router.post('/', authenticateToken, itemService.create);
router.delete('/:id', authenticateToken, itemService.delete);

// GET /api/v1/items
router.get('/', (req, res) => {
  const items = itemService.getAllItems();
  res.status(200).json({
    success: true,
    data: items
  });
});

// GET /api/v1/items/:id
router.get('/:id', (req, res) => {
  const item = itemService.getItemById(req.params.id);
  
  if (!item) {
    // Problem Details JSON format base on requirement (404)
    return res.status(404).json({
      type: "https://example.com/errors/not-found",
      title: "Item Not Found",
      status: 404,
      detail: `Item with ID '${req.params.id}' was not found.`,
      instance: req.originalUrl
    });
  }

  res.status(200).json({
    success: true,
    data: item
  });
});

module.exports = router;