const express = require('express');
require('dotenv').config();
const itemRoutes = require('./src/routes/item.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/items', itemRoutes);

app.listen(PORT, () => {
  console.log(`Inventory Server running on http://localhost:${PORT}`);
});