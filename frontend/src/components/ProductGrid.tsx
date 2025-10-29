import { CircleMinus, CirclePlus } from "lucide-react";
import { useProducts } from "../context/contextManager";
import { useState } from "react";

const ProductGrid = () => {
  const { products, increaseQuantity, decreaseQuantity } = useProducts();
  const [loadingId, setLoadingId] = useState<string | null>(null);

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

  if (!products?.length) {
    return (
      <p className="text-center mt-8 text-gray-500 text-lg">
        No products available right now.
      </p>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-12 my-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
        Products
      </h2>

      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <li
            key={product._id}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between p-5"
          >
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm">
                Price: <span className="font-medium">₹{product.price}</span>
              </p>
            </div>

            <div className="mt-4 flex flex-col items-center gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDecrease(product._id)}
                  disabled={loadingId === product._id}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition disabled:opacity-40"
                >
                  <CircleMinus size={20} />
                </button>
                <span className="font-semibold text-gray-700">
                  {product.quantity}
                </span>
                <button
                  onClick={() => handleIncrease(product._id)}
                  disabled={loadingId === product._id}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition disabled:opacity-40"
                >
                  <CirclePlus size={20} />
                </button>
              </div>

              <p className="text-sm text-gray-500">
                Quantity: {product.quantity}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProductGrid;
