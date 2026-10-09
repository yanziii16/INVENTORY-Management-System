let mockItems = require('../data/items.mock');

class ItemService {
  async getAll(category) {
    if (category) {
      return mockItems.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
    }
    return mockItems;
  }

  async getById(id) {
    const item = mockItems.find((i) => i.id === id || i.id === Number(id));
    return item || null;
  }

  async create(data) {
    const newItem = {
      id: `itm-00${mockItems.length + 1}`,
      name: data.name,
      category: data.category,
      quantity: Number(data.quantity) || 0,
      price: Number(data.price) || 0,
      status: "Available",
      lastUpdated: new Date().toISOString()
    };
    mockItems.push(newItem);
    return newItem;
  }

  async update(id, data) {
    const index = mockItems.findIndex((i) => i.id === id || i.id === Number(id));
    if (index === -1) return null;

    mockItems[index] = {
      ...mockItems[index],
      name: data.name !== undefined ? data.name : mockItems[index].name,
      category: data.category !== undefined ? data.category : mockItems[index].category,
      quantity: data.quantity !== undefined ? Number(data.quantity) : mockItems[index].quantity,
      price: data.price !== undefined ? Number(data.price) : mockItems[index].price,
      lastUpdated: new Date().toISOString()
    };

    return mockItems[index];
  }

  async delete(id) {
    const index = mockItems.findIndex((i) => i.id === id || i.id === Number(id));
    if (index === -1) return null;

    const deletedItem = mockItems[index];
    mockItems = mockItems.filter((i) => i.id !== id && i.id !== Number(id));
    return deletedItem;
  }
}

module.exports = new ItemService();