const request = require("supertest");
const express = require("express");
const app = express();

app.use(express.json());

// Injecting routes
const cartRoutes = require("../routes/cart");
const checkoutRoutes = require("../routes/checkout");
const { users, orders, discounts, seedProducts } = require("../data");

app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);

// Reseting in-memory data before each test
beforeEach(() => {
  seedProducts();
  users["testUser"] = { cart: [] };
  orders.length = 0;
  discounts.length = 0;
});

describe("Checkout API", () => {
  it("should add items to cart and complete checkout without discount", async () => {
    // Adding item to cart
    await request(app)
      .post("/cart/testUser/add")
      .send({ productId: "p1", quantity: 2 })
      .expect(200);

    const res = await request(app)
      .post("/checkout/testUser")
      .send({})
      .expect(200);

    expect(res.body.order).toHaveProperty("id");
    expect(res.body.order.total).toBeGreaterThan(0);
    expect(res.body.order.items.length).toBe(1);
    expect(res.body.message).toBe("Order placed successfully");
  });

  it("should apply discount code if valid", async () => {
    // Adding item to cart
    await request(app)
      .post("/cart/testUser/add")
      .send({ productId: "p1", quantity: 1 });

    discounts.push({ code: "TEST10", used: false, discountPercent: 10 });

    // Checkout using discount
    const res = await request(app)
      .post("/checkout/testUser")
      .send({ discountCode: "TEST10" });

    expect(res.body.order.discountCode).toBe("TEST10");
    expect(res.body.order.total).toBeLessThan(50000);
  });

  it("should reject invalid or used discount codes", async () => {
    // Adding item to cart
    await request(app)
      .post("/cart/testUser/add")
      .send({ productId: "p1", quantity: 1 });

    // To use invalid discount code
    const res = await request(app)
      .post("/checkout/testUser")
      .send({ discountCode: "INVALID" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid or used discount code");
  });

  it("should generate a new discount code every Nth order", async () => {
    const NTH_ORDER = 5;

    for (let i = 1; i <= NTH_ORDER; i++) {
      const userId = `user${i}`;
      users[userId] = { cart: [] };
      await request(app)
        .post(`/cart/${userId}/add`)
        .send({ productId: "p1", quantity: 1 });

      await request(app)
        .post(`/checkout/${userId}`)
        .send({});
    }
  // To generate only one discount code
    expect(discounts.length).toBe(1); 
    expect(discounts[0].code).toBe(`DISCOUNT${NTH_ORDER}`);
  });
});
