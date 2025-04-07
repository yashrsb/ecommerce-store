const request = require("supertest");
const express = require("express");
const app = express();

app.use(express.json());

const checkoutRoutes = require("../routes/checkout");
const cartRoutes = require("../routes/cart");
const adminRoutes = require("../routes/admin");

const { users, orders, discounts, products } = require("../data");


app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/admin", adminRoutes);

beforeEach(() => {
    orders.length = 0;
    discounts.length = 0;
    products.length = 0;
    users["adminUser"] = { cart: [] };
  
    // Adding product for testing
    products.push({ id: "p1", name: "Laptop", price: 50000 });
  });

describe("Admin API", () => {
  it("should return sales stats after a checkout", async () => {
    // Adding item to cart
    await request(app)
      .post("/cart/adminUser/add")
      .send({ productId: "p1", quantity: 1 });

    await request(app)
      .post("/checkout/adminUser")
      .send();

    const res = await request(app).get("/admin/stats");

    expect(res.statusCode).toBe(200);
    expect(res.body.totalOrders).toBe(1);
    expect(res.body.totalAmount).toBeGreaterThan(0);
    expect(Array.isArray(res.body.discountCodes)).toBe(true);
    expect(typeof res.body.totalDiscount).toBe("number");
  });

  it("should show used discount code stats correctly", async () => {
    discounts.push({ code: "SPECIAL", used: false, discountPercent: 10 });

    await request(app)
      .post("/cart/adminUser/add")
      .send({ productId: "p1", quantity: 1 });

    await request(app)
      .post("/checkout/adminUser")
      .send({ discountCode: "SPECIAL" });

    const res = await request(app).get("/admin/stats");

    expect(res.body.discountCodes.length).toBeGreaterThanOrEqual(1);
    const special = res.body.discountCodes.find(d => d.code === "SPECIAL");
    expect(special.used).toBe(true);
  });
});
