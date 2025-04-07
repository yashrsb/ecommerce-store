const express = require("express");
const { orders, discounts } = require("../data");
const router = express.Router();

// Getting order stats
router.get("/stats", (req, res) => {
  try {
    const totalAmount = orders.reduce((sum, order) => sum + order.total, 0);
    const discountAmount = discounts.reduce((sum, d) => (d.used ? sum + d.discountPercent : sum), 0);

    res.json({
      totalOrders: orders.length,
      totalAmount,
      discountCodes: discounts.map(d => ({ code: d.code, used: d.used })),
      totalDiscount: discountAmount,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Internal server error while fetching stats." });
  }
});

module.exports = router;
