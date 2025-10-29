import { CircleMinus, CirclePlus, MoveRightIcon, ShoppingCart } from "lucide-react";
import Navbar from "../components/Navbar";
import { useProducts } from "../context/contextManager";
import { useState } from "react";
import { Link } from "react-router-dom";

const Cart = () => {
  const { products, increaseQuantity, decreaseQuantity } = useProducts();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const cartItems = products.filter((p) => p.quantity > 0);
  const total = cartItems.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const handleIncrease = async (id: string) => {
    setLoadingId(id);
    await increaseQuantity(id);
    setLoadingId(null);
  };

  const handleDecrease = async (id: string) => {
    setLoadingId(id);
    await decreaseQuantity(id);
    setLoadingId(null);
  };

  return (
    <>
      <Navbar />

      <section className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Your Cart
        </h2>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 py-16">
            <ShoppingCart size={64} className="mb-4 opacity-50" />
            <p className="text-lg">Your cart is empty.</p>
            <Link
              to="/"
              className="mt-4 bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-gray-500 text-sm">
                      ₹{item.price} each
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDecrease(item._id)}
                      disabled={loadingId === item._id}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition disabled:opacity-40"
                    >
                      <CircleMinus size={18} />
                    </button>
                    <span className="font-semibold text-gray-700 w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleIncrease(item._id)}
                      disabled={loadingId === item._id}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition disabled:opacity-40"
                    >
                      <CirclePlus size={18} />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total + Checkout */}
            <div className="flex justify-between items-center border-t pt-6 mt-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                Total: ₹{total.toFixed(2)}
              </h3>

              <Link to="/checkout">
                <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition">
                  Checkout <MoveRightIcon size={20} />
                </button>
              </Link>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default Cart;
