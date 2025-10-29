import express from "express";
import connectDB from "./db/connectDB.js";
import dotenv from 'dotenv';
import Product from "./models/productSchema.js";
import Cart from "./models/cartSchema.js";
import PDFDocument from "pdfkit";
import cors from 'cors';
const app = express();
const port = process.env.PORT || 3000;


dotenv.config();
await connectDB();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})
  ;

app.get('/api/products', async (req, res) => {
  try {

    const products = await Product.find();
    return res.json({ products });
  } catch (error) {
    console.log(error);
  }
})

// cart related api
app.post('/api/cart/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    let cartData = await Cart.findOne({ name: "guest" });

    if (!cartData) {
      cartData = await Cart.create({
        name: "guest",
        cartItems: [{ productId, quantity: 1 }],
      });
      return res.json({ cart: cartData });
    }

    const existingItem = cartData.cartItems.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      const updatedCart = await Cart.findOneAndUpdate(
        { name: "guest", "cartItems.productId": productId },
        { $inc: { "cartItems.$.quantity": 1 } },
        { new: true }
      );
      return res.status(200).json({ cart: updatedCart });
    } else {
      const updatedCart = await Cart.findOneAndUpdate(
        { name: "guest" },
        { $push: { cartItems: { productId, quantity: 1 } } },
        { new: true }
      );
      return res.status(200).json({ cart: updatedCart });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


app.delete('/api/cart/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    const cartData = await Cart.findOne({ name: "guest" });
    if (!cartData) return res.status(404).json({ message: "Cart not found" });

    const existingItem = cartData.cartItems.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem && existingItem.quantity > 1) {
      const updatedCart = await Cart.findOneAndUpdate(
        { name: "guest", "cartItems.productId": productId },
        { $inc: { "cartItems.$.quantity": -1 } },
        { new: true }
      );
      return res.status(200).json({ cart: updatedCart });
    } else {
      const updatedCart = await Cart.findOneAndUpdate(
        { name: "guest" },
        { $pull: { cartItems: { productId } } },
        { new: true }
      );
      return res.status(200).json({ cart: updatedCart });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



app.get("/api/cart", async (req, res) => {
  try {
    const cartData = await Cart.findOne({ name: "guest" }).populate("cartItems.productId");
    if (!cartData) return res.status(404).json({ message: "Cart not found" });

    const transformedCart = cartData.cartItems.map(item => ({
      product: item.productId,
      quantity: item.quantity,
      _id: item._id,
    }));

    const total = transformedCart.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    return res.status(200).json({ cart: transformedCart, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



app.post("/api/checkout", async (req, res) => {
  try {
    const { name, email } = await req.body;

   
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required." });
    }

    // Fetch the user's cart 
    const cartData = await Cart.findOne({ name: "guest" }).populate("cartItems.productId");
    if (!cartData) return res.status(404).json({ message: "Cart not found" });

    const transformedCart = cartData.cartItems.map(item => ({
      product: item.productId,
      quantity: item.quantity,
    }));

    const total = transformedCart.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    // Generate PDF invoice
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="invoice.pdf"');
    doc.pipe(res);

    // --- HEADER ---
    doc.fontSize(20).text("Checkout Invoice", { align: "center" });
    doc.moveDown();

    // --- CUSTOMER DETAILS ---
    doc.fontSize(12).text(`Customer Name: ${name}`);
    doc.text(`Customer Email: ${email}`);
    doc.text(`Date: ${new Date().toLocaleString()}`);
    doc.moveDown();

    // --- ITEMS ---
    doc.fontSize(14).text("Items:", { underline: true });
    doc.moveDown(0.5);

    transformedCart.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.product.name} — ₹${item.product.price} × ${item.quantity} = ₹${item.product.price * item.quantity}`
      );
    });

    // --- TOTAL ---
    doc.moveDown();
    doc.fontSize(16).text(`Total: ₹${total}`);
    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
})
