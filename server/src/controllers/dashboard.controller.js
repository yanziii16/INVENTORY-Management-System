const pool = require('../config/db');

const getDashboardSummary = async (req, res) => {
  try {
    // 1. Total stock value
    const totalValue = await pool.query(
      `SELECT SUM(quantity * price) AS total_inventory_value FROM items`
    );

    // 2. Low stock items (lowe than min_stock_alert)
    const lowStock = await pool.query(
      `SELECT * FROM items WHERE quantity <= min_stock_alert AND quantity > 0`
    );

    // 3. Out of stock items
    const outOfStock = await pool.query(
      `SELECT * FROM items WHERE quantity = 0`
    );

    // 4. Quick stats
    const totalItems = await pool.query(`SELECT COUNT(*) FROM items`);
    const totalCategories = await pool.query(`SELECT COUNT(*) FROM categories`);

    res.json({
      summary: {
        totalInventoryValue: parseFloat(totalValue.rows[0].total_inventory_value || 0),
        totalItemsCount: parseInt(totalItems.rows[0].count),
        totalCategoriesCount: parseInt(totalCategories.rows[0].count),
        lowStockAlertCount: lowStock.rows.length,
        outOfStockCount: outOfStock.rows.length
      },
      lowStockItems: lowStock.rows,
      outOfStockItems: outOfStock.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDashboardSummary };
