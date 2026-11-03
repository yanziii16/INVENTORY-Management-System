const pool = require('../config/db');

class ItemService {
  async getAll(category) {
    if (category) {
      const query = `SELECT * FROM items WHERE LOWER(category) = LOWER($1)`;
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
      INSERT INTO items (name, category, quantity, price, status, last_updated)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `;
    const values = [
      data.name,
      data.category,
      Number(data.quantity) || 0,
      Number(data.price) || 0,
      "Available"
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async update(id, data) {
    // Dynamic update query builder
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
    if (data.quantity !== undefined) {
      fields.push(`quantity = $${idx++}`);
      values.push(Number(data.quantity));
    }
    if (data.price !== undefined) {
      fields.push(`price = $${idx++}`);
      values.push(Number(data.price));
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