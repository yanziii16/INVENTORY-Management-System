const pool = require('../config/db');

class ItemService {
  async getAll(category) {
    if (category) {
      const query = `SELECT * FROM items WHERE LOWER(category) = LOWER($1) ORDER BY id ASC`;
      const result = await pool.query(query, [category]);
      return result.rows;
    }
    const result = await pool.query(`SELECT * FROM items ORDER BY id ASC`);
    return result.rows;
  }

  async getById(id) {
    const query = `SELECT * FROM items WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async create(data) {
    const query = `
      INSERT INTO items (
        name,
        category,
        sku,
        quantity,
        unit,
        min_stock_alert,
        price,
        condition,
        storage_location,
        description,
        status,
        last_updated
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      RETURNING *
    `;
    const values = [
      data.name,
      data.category,
      data.sku || null,
      Number(data.quantity) || 0,
      data.unit || 'pcs',
      Number(data.min_stock_alert ?? data.reorder_level) || 10,
      Number(data.price ?? data.unit_price) || 0,
      data.condition || 'Good',
      data.storage_location || null,
      data.description || null,
      'Available'
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    let idx = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${idx++}`);
      values.push(data.name);
    }
    if (data.category !== undefined) {
      fields.push(`category = $${idx++}`);
      values.push(data.category);
    }
    if (data.sku !== undefined) {
      fields.push(`sku = $${idx++}`);
      values.push(data.sku);
    }
    if (data.quantity !== undefined) {
      fields.push(`quantity = $${idx++}`);
      values.push(Number(data.quantity));
    }
    if (data.unit !== undefined) {
      fields.push(`unit = $${idx++}`);
      values.push(data.unit);
    }
    if (data.min_stock_alert !== undefined || data.reorder_level !== undefined) {
      fields.push(`min_stock_alert = $${idx++}`);
      values.push(Number(data.min_stock_alert ?? data.reorder_level));
    }
    if (data.price !== undefined || data.unit_price !== undefined) {
      fields.push(`price = $${idx++}`);
      values.push(Number(data.price ?? data.unit_price));
    }
    if (data.condition !== undefined) {
      fields.push(`condition = $${idx++}`);
      values.push(data.condition);
    }
    if (data.storage_location !== undefined) {
      fields.push(`storage_location = $${idx++}`);
      values.push(data.storage_location);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${idx++}`);
      values.push(data.description);
    }
    if (data.status !== undefined) {
      fields.push(`status = $${idx++}`);
      values.push(data.status);
    }

    fields.push(`last_updated = NOW()`);
    values.push(id);

    const query = `
      UPDATE items
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id) {
    const query = `DELETE FROM items WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
}

module.exports = new ItemService();