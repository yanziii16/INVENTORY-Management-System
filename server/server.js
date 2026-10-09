const express = require('express');
require('dotenv').config();

// 1. Import Routes
const itemRoutes = require('./src/routes/item.routes');
const authRoutes = require('./src/routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to read JSON payload
app.use(express.json());

// 2. Health Check Endpoint 
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 3. API Routes under /api/v1 prefix
app.use('/api/v1/items', itemRoutes);
app.use('/api/v1/auth', authRoutes);

// 4. Start Server
app.listen(PORT, () => {
  console.log(`Inventory Server running on http://localhost:${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/api/v1/health`);
});