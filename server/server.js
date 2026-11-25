require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Import Routes
const itemRoutes = require('./src/routes/item.routes');
const authRoutes = require('./src/routes/auth.routes');
const transactionRoutes = require('./src/routes/inventory-transaction.routes');
const userRoutes = require('./src/routes/user.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Swagger Docs setup
try {
  const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
} catch (err) {
  console.log('Swagger YAML not loaded:', err.message);
}

// Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: "ok", service: 'inventory-backend' });
});

// API Routes under /api/v1 prefix
app.use('/api/v1/items', itemRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/inventory-transactions', transactionRoutes);
app.use('/api/v1/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Inventory Server running on http://localhost:${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/api/v1/health`);
});