const express = require("express");
const { products, users } = require("../data");
const router = express.Router();

// Adding item to cart
router.post("/:userId/add", (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Product ID and quantity are required." });
    }

    if (!users[userId]) users[userId] = { cart: [] };

    const product = products.find((p) => p.id === productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    users[userId].cart.push({ productId, quantity, price: product.price });
    res.json({ message: "Item added to cart", cart: users[userId].cart });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Internal server error while adding to cart." });
  }
});

// Checking cart
router.get("/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    res.json(users[userId]?.cart || []);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Internal server error while fetching cart." });
  }
});

module.exports = router;
