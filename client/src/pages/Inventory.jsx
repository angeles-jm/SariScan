import React, { useCallback, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import ItemsList from "../components/ItemsList";
import AddProducts from "../components/AddProducts";
import { CiFilter } from "react-icons/ci";
import { useStore } from "../context/StoreContext";
import { useParams } from "react-router-dom";

const Inventory = () => {
  const { setStoreId, fetchAllStoreProducts } = useStore();

  const { storeId } = useParams();

  const fetchData = useCallback(() => {
    if (storeId) {
      setStoreId(storeId);
      fetchAllStoreProducts();
    }
  }, [storeId, setStoreId, fetchAllStoreProducts]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleProductAdded = () => {
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <SearchBar />
          <div className="flex items-center gap-2 mt-4 text-emerald-600 cursor-pointer hover:text-emerald-700 transition-colors duration-300">
            <CiFilter className="text-2xl" />
            <span className="font-medium">Filter items</span>
          </div>
        </div>

        {/* {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-r-lg"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )} */}

        <div className="mb-20">
          <ItemsList />
        </div>

        <div className="fixed bottom-0 left-0 right-0 py-4">
          <div className="container mx-auto px-4 flex justify-center">
            <AddProducts onProductAdded={handleProductAdded} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
