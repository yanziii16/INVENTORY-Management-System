const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Temporary in-memory users storage for mock mode
let mockUsers = [
  {
    id: "USR-2026-0001",
    fullName: "Angela Reyes",
    email: "AngelaReyes@college.edu",
    password_hash: bcrypt.hashSync("adminPassword123", 10),
    role: "admin"
  }
];

// POST /api/v1/auth/signup
router.post('/signup', async (req, res) => {
  const { fullName, email, password, role } = req.body;
  
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ success: false, message: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: `USR-2026-000${mockUsers.length + 1}`,
    fullName,
    email,
    password_hash: hashedPassword,
    role: role || "user"
  };

  mockUsers.push(newUser);
  res.status(201).json({
    success: true,
    message: "User created successfully (Mock mode)",
    user: { userId: newUser.id, fullName, email, role: newUser.role }
  });
});

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = mockUsers.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'supersecretkey_inventory_2026',
    { expiresIn: '8h' }
  );

  res.json({
    success: true,
    token,
    user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role }
  });
});

module.exports = router;