import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/productSchema.js";


dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

const products = [
  { name: "Shampoo", price: 200 },
  { name: "Conditioner", price: 250 },
  { name: "Toothpaste", price: 120 },
  { name: "Face Wash", price: 180 },
  { name: "Body Lotion", price: 300 },
  { name: "Soap Bar", price: 90 },
  { name: "Hair Oil", price: 220 },
  { name: "Deodorant", price: 350 },
  { name: "Hand Sanitizer", price: 150 },
  { name: "Shaving Cream", price: 175 },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    await Product.deleteMany(); 
    await Product.insertMany(products);
    console.log("Products inserted successfully");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding data:", err);
  }
};

seedDB();
