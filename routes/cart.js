const express = require("express");
const { products, users } = require("../data");
const router = express.Router();

// Adding item to cart
router.post("/:userId/add", (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  if (!users[userId]) users[userId] = { cart: [] };

  const product = products.find((p) => p.id === productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  users[userId].cart.push({ productId, quantity, price: product.price });
  res.json({ message: "Item added to cart", cart: users[userId].cart });
});

// Checking cart
router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  res.json(users[userId]?.cart || []);
});

module.exports = router;
