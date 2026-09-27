const db = require('../config/db');

class ItemService {
  async getAll(category) {
    if (category) {
      const result = await db.query(
        'SELECT * FROM items WHERE LOWER(category) = LOWER($1) ORDER BY id ASC',
        [category]
      );
      return result.rows;
    }
    const result = await db.query('SELECT * FROM items ORDER BY id ASC');
    return result.rows;
  }

  async getById(id) {
    const result = await db.query('SELECT * FROM items WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async create(data) {
    const { name, category, quantity, price } = data;
    const result = await db.query(
      'INSERT INTO items (name, category, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, category, quantity, price]
    );
    return result.rows[0];
  }

  async update(id, data) {
    const currentItem = await this.getById(id);
    if (!currentItem) return null;

    const name = data.name !== undefined ? data.name : currentItem.name;
    const category = data.category !== undefined ? data.category : currentItem.category;
    const quantity = data.quantity !== undefined ? data.quantity : currentItem.quantity;
    const price = data.price !== undefined ? data.price : currentItem.price;

    const result = await db.query(
      'UPDATE items SET name = $1, category = $2, quantity = $3, price = $4 WHERE id = $5 RETURNING *',
      [name, category, quantity, price, id]
    );
    return result.rows[0];
  }

  async delete(id) {
    const result = await db.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
  }
}

module.exports = new ItemService();