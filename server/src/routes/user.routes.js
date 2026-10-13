const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');

// Mock users data
const mockUsers = [
  {
    id: "USR-2026-0001",
    fullName: "Angela Reyes",
    email: "AngelaReyes@college.edu",
    role: "admin"
  },
  {
    id: "USR-2026-0002",
    fullName: "Storekeeper User",
    email: "storekeeper@college.edu",
    role: "storekeeper"
  }
];

// GET /api/v1/users - Get the list of users.
router.get('/', authenticateToken, (req, res) => {
  return res.status(200).json({
    success: true,
    data: mockUsers
  });
});

module.exports = router;