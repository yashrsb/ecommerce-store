const { v4: uuidv4 } = require("uuid");

const products = [];
const users = {};
const orders = [];
const discounts = [];
const NTH_ORDER = 5;

// Auto-Seeding data when server starts
function seedProducts() {
  // To Clear existing records
  products.length = 0; 
  products.push(
    { id: "p1", name: "Laptop", price: 50000 },
    { id: "p2", name: "Smartphone", price: 30000 },
    { id: "p3", name: "Headphones", price: 3000 }
  );
  console.log("Products seeded!");
}

module.exports = {
  products,
  users,
  orders,
  discounts,
  NTH_ORDER,
  seedProducts,
};
