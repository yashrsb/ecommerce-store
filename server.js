const express = require("express");
const app = express();
const PORT = 3000;

const { seedProducts } = require("./data");

app.use(express.json());

// Routes
app.use("/cart", require("./routes/cart"));
app.use("/checkout", require("./routes/checkout"));
app.use("/admin", require("./routes/admin"));

// Auto seeding products
seedProducts();

app.get("/", (req, res) => res.send("Ecommerce Store API"));

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
