const pool = require('../config/db'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User (Only Super Admins should be able to create users.)
const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      `INSERT INTO users (username, email, password_hash, role) 
       VALUES ($1, $2, $3, $4) RETURNING id, username, email, role`,
      [username, email, hashedPassword, role || 'cashier']
    );
    res.status(201).json({ message: "User created successfully", user: newUser.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (userResult.rows.length === 0) return res.status(400).json({ message: "Invalid email or password" });

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.id, role: user.role, username: user.username },
      process.env.JWT_SECRET || 'supersecretkey',
      { expiresIn: '8h' }
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser };
