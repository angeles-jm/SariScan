import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import ItemsList from "../components/ItemsList";
import AddProducts from "../components/AddProducts";
import axios from "axios";
import { CiFilter } from "react-icons/ci";
import { useAuth } from "../context/AuthContext";

// Search
// Filter
// List of the items in the backend

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [allProducts, setAllProducts] = useState(products);

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
      setError(error.message);
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
    <div className="bg-slate-50 h-full">
      <div className="container px-4 mx-auto max-h-screen flex flex-col gap-2">
        <SearchBar
          searchValue={searchValue}
          handleSearchChange={(e) => setSearchValue(e.target.value)}
          onSubmit={(e) => searchItem(e)}
        />
        <div className="flex items-center gap-2">
          <CiFilter /> <span className="">Filter items X</span>
        </div>

        <ItemsList products={products} loading={loading} />
        <div className="flex  justify-center">
          <AddProducts />
        </div>
      </div>
    </div>
  );
};

export default Inventory;
