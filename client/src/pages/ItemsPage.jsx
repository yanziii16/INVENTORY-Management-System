const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const fetchItems = async () => {
  const response = await fetch(`${API_URL}/api/v1/items`);
  const data = await response.json();
  return data;
};