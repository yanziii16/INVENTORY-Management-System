const express = require('express');
const router = express.Router();

const itemService = require('../services/item.service');
const { authenticateToken } = require('../middleware/auth.middleware');

// GET all items (Retrieve all items with support for ?category=... query parameter)
router.get('/', async (req, res) => {
  try {
    const items = await itemService.getAll(req.query.category);

    return res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Get items error:', error);
    return res.status(500).json({
      message: 'Failed to retrieve items.'
    });
  }
});

// POST create new item
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { itemName, name, category, quantity } = req.body;

    const finalName = itemName || name;

    if (
      !finalName ||
      typeof finalName !== 'string' ||
      !finalName.trim() ||
      !category ||
      typeof category !== 'string' ||
      quantity === undefined ||
      quantity === null ||
      quantity === '' ||
      !Number.isFinite(Number(quantity)) ||
      Number(quantity) < 0
    ) {
      return res.status(400).json({
        message: 'Please provide a valid itemName, category, and quantity.'
      });
    }

    const newItem = await itemService.create({
      name: finalName.trim(),
      category: category.trim(),
      quantity: Number(quantity)
    });

    return res.status(201).json({
      success: true,
      message: 'Item created successfully.',
      data: newItem
    });
  } catch (error) {
    console.error('Create item error:', error);
    return res.status(500).json({
      message: 'Failed to create item.'
    });
  }
});

// GET item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await itemService.getById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: 'Item not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Get item error:', error);
    return res.status(500).json({
      message: 'Failed to retrieve item.'
    });
  }
});

// PUT update existing item
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { itemName, name, category, quantity, price } = req.body;

    const updateData = {};

    if (itemName !== undefined) {
      updateData.name = itemName;
    } else if (name !== undefined) {
      updateData.name = name;
    }

    if (category !== undefined) {
      updateData.category = category;
    }

    if (quantity !== undefined) {
      updateData.quantity = Number(quantity);
    }

    if (price !== undefined) {
      updateData.price = Number(price);
    }

    const updatedItem = await itemService.update(
      req.params.id,
      updateData
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Item updated successfully.',
      data: updatedItem
    });
  } catch (error) {
    console.error('Update item error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update item.'
    });
  }
});

// DELETE item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deletedItem = await itemService.delete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({
        message: 'Item not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Item deleted successfully.'
    });
  } catch (error) {
    console.error('Delete item error:', error);
    return res.status(500).json({
      message: 'Failed to delete item.'
    });
  }
});

// POST create new item
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { itemName, name, category, quantity } = req.body;

    const finalName = itemName || name;

    if (
      !finalName ||
      typeof finalName !== 'string' ||
      !finalName.trim() ||
      !category ||
      typeof category !== 'string' ||
      quantity === undefined ||
      quantity === null ||
      quantity === '' ||
      !Number.isFinite(Number(quantity)) ||
      Number(quantity) < 0
    ) {
      return res.status(400).json({
        message: 'Please provide a valid itemName, category, and quantity.'
      });
    }

    const newItem = await itemService.create({
      name: finalName.trim(),
      category: category.trim(),
      quantity: Number(quantity)
    });

    return res.status(201).json({
      success: true,
      message: 'Item created successfully.',
      data: newItem
    });
  } catch (error) {
    console.error('Create item error:', error);
    return res.status(500).json({
      message: 'Failed to create item.'
    });
  }
});

// GET item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await itemService.getById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: 'Item not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Get item error:', error);
    return res.status(500).json({
      message: 'Failed to retrieve item.'
    });
  }
});

// PUT update existing item
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { itemName, name, category, quantity, price } = req.body;

    const updateData = {};

    if (itemName !== undefined) {
      updateData.name = itemName;
    } else if (name !== undefined) {
      updateData.name = name;
    }

    if (category !== undefined) {
      updateData.category = category;
    }

    if (quantity !== undefined) {
      updateData.quantity = Number(quantity);
    }

    if (price !== undefined) {
      updateData.price = Number(price);
    }

    const updatedItem = await itemService.update(
      req.params.id,
      updateData
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Item updated successfully.',
      data: updatedItem
    });
  } catch (error) {
    console.error('Update item error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update item.'
    });
  }
});

// DELETE item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deletedItem = await itemService.delete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({
        message: 'Item not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Item deleted successfully.'
    });
  } catch (error) {
    console.error('Delete item error:', error);
    return res.status(500).json({
      message: 'Failed to delete item.'
    });
  }
});

module.exports = router;