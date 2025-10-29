import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface CartItem {
  product: Product;
  quantity: number;
  _id: string;
}

interface CartData {
  cart: CartItem[];
  total: number;
}

const Checkout = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [cartData, setCartData] = useState<CartData>({ cart: [], total: 0 });
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/cart`);
        if (!res.ok) throw new Error("Failed to load cart");
        const data = await res.json();
        setCartData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCart();
  }, [backendUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Checkout
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) setSuccess(true);
      else console.error("Checkout failed");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Navbar />
        <section className="max-w-[600px] mx-auto text-center mt-24 p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-3xl font-semibold mb-3 text-green-600">
            🎉 Thank you for your order!
          </h2>
          <p className="text-gray-600 mb-8">
            Your invoice is being downloaded automatically.
          </p>
          <a
            href="/"
            className="inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-all"
          >
            Continue Shopping
          </a>
        </section>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="max-w-[900px] mx-auto mt-10 p-6 flex flex-col md:flex-row gap-8 bg-white rounded-xl shadow-md">
        {/* Form Section */}
        <form
          onSubmit={handleCheckout}
          className="flex-1 flex flex-col gap-4 border border-gray-200 rounded-xl p-6"
        >
          <h2 className="text-2xl font-semibold mb-2">Billing Details</h2>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          />

          <button
            type="submit"
            className="bg-black text-white py-3 rounded-lg font-medium mt-4 hover:bg-gray-800 transition-all disabled:opacity-50"
            disabled={loading || cartData.cart.length === 0}
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </form>

        {/* Summary Section */}
        <div className="flex-1 border border-gray-200 rounded-xl p-6 bg-gray-50">
          <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
          {cartData.cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <>
              <ul className="flex flex-col gap-3">
                {cartData.cart.map((item) => (
                  <li
                    key={item._id}
                    className="flex justify-between border-b border-gray-200 pb-2 text-gray-700"
                  >
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between mt-5 text-lg font-semibold text-gray-900">
                <span>Total:</span>
                <span>₹{cartData.total}</span>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Checkout;
