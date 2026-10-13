const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');

// 1. Initial Mock Data para may maibalik agad kapag nag-GET
const transactions = [
  {
    transactionId: "TRX-0001",
    itemId: "itm-001",
    transactionType: "STOCK_IN",
    quantity: 50,
    createdAt: new Date().toISOString()
  },
  {
    transactionId: "TRX-0002",
    itemId: "itm-001",
    transactionType: "STOCK_OUT",
    quantity: 5,
    createdAt: new Date().toISOString()
  },
  {
    transactionId: "TRX-0003",
    itemId: "itm-002",
    transactionType: "STOCK_IN",
    quantity: 20,
    createdAt: new Date().toISOString()
  }
];

// GET /api/v1/inventory-transactions - Kunin ang history (may support sa ?itemId=...)
router.get('/', authenticateToken, (req, res) => {
  const { itemId } = req.query;

  // Kung may ipinasa na itemId sa query params (hal. ?itemId=itm-001), i-filter ito
  let result = transactions;
  if (itemId) {
    result = transactions.filter(t => t.itemId === itemId);
  }

  return res.status(200).json({
    success: true,
    data: result
  });
});

// POST a transaction
router.post('/', authenticateToken, (req, res) => {
  const { itemId, transactionType, quantity } = req.body;

  if (
    !itemId ||
    !['STOCK_IN', 'STOCK_OUT'].includes(transactionType) ||
    !Number.isInteger(quantity) ||
    quantity <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: 'Provide a valid itemId, transactionType, and positive integer quantity.'
    });
  }

  const transaction = {
    transactionId: `TRX-${String(transactions.length + 1).padStart(4, '0')}`,
    itemId,
    transactionType,
    quantity,
    createdAt: new Date().toISOString()
  };

  transactions.push(transaction);

  return res.status(201).json({
    success: true,
    message: 'Transaction recorded.',
    data: transaction
  });
});

module.exports = router;