import React, { useCallback, useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import ItemsList from "../components/ItemsList";
import AddProducts from "../components/AddProducts";
import axios from "axios";
import { CiFilter } from "react-icons/ci";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { useParams } from "react-router-dom";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [allProducts, setAllProducts] = useState(products);

  const { setStoreId, setProductBarcode, storeProductAndBarcode } = useStore();
  const { storeId } = useParams();

  useMemo(() => storeId, [storeId]);
  console.log(JSON.stringify(storeId, null, 2));

  const API = "http://localhost:3000";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API}/api/products`);
      setProducts(response.data);
      setAllProducts(response.data);
      setLoading(false);
    } catch (error) {
      setError("Product not found!", error.message);
      setLoading(false);
    }
  };

  const searchItem = (e) => {
    e.preventDefault();
    if (searchValue === "") return setProducts(allProducts);

    const filterBySearch = allProducts.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    setProducts(filterBySearch);
    setSearchValue("");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <SearchBar
            searchValue={searchValue}
            handleSearchChange={(e) => setSearchValue(e.target.value)}
            onSubmit={searchItem}
          />
          <div className="flex items-center gap-2 mt-4 text-emerald-600 cursor-pointer hover:text-emerald-700 transition-colors duration-300">
            <CiFilter className="text-2xl" />
            <span className="font-medium">Filter items</span>
          </div>
        </div>

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-r-lg"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        <div className="mb-20">
          <ItemsList products={products} loading={loading} />
        </div>

        <div className="fixed bottom-0 left-0 right-0 py-4">
          <div className="container mx-auto px-4 flex justify-center">
            <AddProducts />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
