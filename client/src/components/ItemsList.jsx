import React, { useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { useStore } from "../context/StoreContext";

const ItemsList = () => {
  const { storeProductAndBarcode, error, isLoading } = useStore();

  // Loading animation(should change to its own Component)
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Checker to see if the products length is empty.
  if (!storeProductAndBarcode || storeProductAndBarcode.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">No products found.</p>
      </div>
    );
  }

  // This will extract the nested object.
  const allProducts =
    storeProductAndBarcode[0]?.products.map((item) => item.products) || [];

  return (
    <div className="space-y-4">
      {allProducts.map((product, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center p-4">
            <div className="flex-shrink-0">
              <img
                src={
                  product.imageUrl ||
                  "https://via.placeholder.com/150?text=No+Image"
                }
                alt={product.name || "Product"}
                className="h-20 w-20 object-contain rounded-md"
              />
            </div>
            <div className="ml-4 flex-grow">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {product.name || "Unnamed Product"}
              </h3>
              <p className="text-emerald-600 font-medium mt-1">
                PHP{" "}
                {typeof product.price === "number"
                  ? product.price.toFixed(2)
                  : "N/A"}
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
