const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

const { seedProducts } = require("./data");

app.use(express.json());

app.use(cors());

// Routes
app.use("/cart", require("./routes/cart"));
app.use("/checkout", require("./routes/checkout"));
app.use("/admin", require("./routes/admin"));

// Auto seeding products
seedProducts();

app.get("/", (req, res) => res.send("Ecommerce Store API"));

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
