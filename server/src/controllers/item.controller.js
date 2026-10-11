const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');

// Temporary in-memory storage para sa mga items
let mockItems = [
  {
    itemId: "INV-2026-0001",
    itemName: "Dell OptiPlex Desktop Computer",
    category: "Computer Equipment",
    quantity: 25
  }
];

// GET /api/v1/items - Kunin ang lahat ng items
router.get('/', (req, res) => {
  res.status(200).json(mockItems);
});

// POST /api/v1/items - Gumawa ng bagong item (Protected)
router.post('/', authenticateToken, (req, res) => {
  const { itemName, category, quantity } = req.body;
  
  if (!itemName || !category || quantity === undefined) {
    return res.status(400).json({ message: "Missing required item fields" });
  }

  const newItem = {
    itemId: `INV-2026-000${mockItems.length + 1}`,
    itemName,
    category,
    quantity
  };

  mockItems.push(newItem);
  res.status(201).json(newItem);
});

// GET /api/v1/items/:id - Kunin ang item gamit ang ID
router.get('/:id', (req, res) => {
  const item = mockItems.find(i => i.itemId === req.params.id);
  
  if (!item) {
    return res.status(404).json({
      statusCode: 404,
      message: `Item with ID '${req.params.id}' was not found.`
    });
  }

  res.status(200).json(item);
});

// DELETE /api/v1/items/:id - Burahin ang item (Protected)
router.delete('/:id', authenticateToken, (req, res) => {
  const index = mockItems.findIndex(i => i.itemId === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      statusCode: 404,
      message: "Item not found"
    });
  }

  mockItems.splice(index, 1);
  res.status(204).send();
});

module.exports = router;