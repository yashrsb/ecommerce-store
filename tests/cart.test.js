const request = require("supertest");
const express = require("express");
const app = express();

app.use(express.json());

const cartRoutes = require("../routes/cart");
const { users } = require("../data");

app.use("/cart", cartRoutes);

beforeEach(() => {
  users["cartUser"] = { cart: [] };
});

describe("Cart API", () => {
  it("should add item to the cart", async () => {
    const res = await request(app)
      .post("/cart/cartUser/add")
      .send({ productId: "p1", quantity: 2 });

    expect(res.statusCode).toBe(200);
    expect(res.body.cart.length).toBe(1);
    expect(res.body.cart[0].productId).toBe("p1");
    expect(res.body.message).toBe("Item added to cart");
  });

  it("should return cart contents", async () => {
    await request(app)
      .post("/cart/cartUser/add")
      .send({ productId: "p1", quantity: 1 });

    const res = await request(app).get("/cart/cartUser");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].productId).toBe("p1");
  });

  it("should handle invalid product ID", async () => {
    const res = await request(app)
      .post("/cart/cartUser/add")
      .send({ productId: "invalid", quantity: 1 });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Product not found");
  });
});
