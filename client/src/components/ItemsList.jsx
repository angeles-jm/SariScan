import React from "react";
import { ShoppingBag } from "lucide-react";

const ItemsList = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center p-4">
            <div className="flex-shrink-0">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-20 w-20 object-contain rounded-md"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/150?text=No+Image";
                }}
              />
            </div>
            <div className="ml-4 flex-grow">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {product.name}
              </h3>
              <p className="text-emerald-600 font-medium mt-1">
                PHP {parseFloat(product.price).toFixed(2)}
              </p>
            </div>
            <div className="flex-shrink-0 ml-4">
              <ShoppingBag className="h-6 w-6 text-gray-400 hover:text-emerald-500 cursor-pointer transition-colors duration-300" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemsList;
