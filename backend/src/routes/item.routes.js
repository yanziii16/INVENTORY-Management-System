const express = require('express');
const router = express.Router();
const itemService = require('../services/item.service');
const { checkApiKey } = require('../middleware/auth');
const { validateItemInput } = require('../middleware/validate');

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const items = await itemService.getAll(category);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await itemService.getById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', checkApiKey, validateItemInput, async (req, res) => {
  try {
    const newItem = await itemService.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await itemService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Item not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await itemService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted successfully", item: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;