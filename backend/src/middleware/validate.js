const validateItemInput = (req, res, next) => {
  const { name, category, quantity, price } = req.body;
  if (!name || !category || quantity === undefined || price === undefined) {
    return res.status(400).json({ message: "Missing required fields: name, category, quantity, price" });
  }
  if (typeof quantity !== 'number' || typeof price !== 'number') {
    return res.status(400).json({ message: "Quantity and Price must be valid numbers" });
  }
  next();
};

module.exports = { validateItemInput };