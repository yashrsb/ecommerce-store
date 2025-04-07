const express = require("express");
const { users, orders, discounts, NTH_ORDER } = require("../data");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

// Order Checkout by User
router.post("/:userId", (req, res) => {
  const { userId } = req.params;
  const { discountCode } = req.body;
  
  if (!users[userId] || users[userId].cart.length === 0)
    return res.status(400).json({ message: "Cart is empty" });

  let total = users[userId].cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let discount = 0;

  if (discountCode) {
    const discountObj = discounts.find(d => d.code === discountCode && !d.used);
    if (!discountObj) return res.status(400).json({ message: "Invalid or used discount code" });

    discount = (total * discountObj.discountPercent) / 100;
    total -= discount;
    discountObj.used = true;
  }

  const order = { id: uuidv4(), userId, items: users[userId].cart, total, discountCode };
  orders.push(order);
  users[userId].cart = [];

  if (orders.length % NTH_ORDER === 0) {
    const newCode = `DISCOUNT${orders.length}`;
    discounts.push({ code: newCode, used: false, discountPercent: 10 });
  }

  res.json({ message: "Order placed successfully", order });
});

module.exports = router;
