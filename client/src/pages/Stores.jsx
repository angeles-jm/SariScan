import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useStore } from "../context/StoreContext";
import { Link, Navigate, useNavigate } from "react-router-dom";

const API = "http://localhost:3000";

const Stores = () => {
  const {
    stores,
    isLoading,
    storeId,
    storeProductAndBarcode,
    setStoreId,
    setProductBarcode,
    fetchStores,
  } = useStore();

  const navigate = useNavigate();

  const [createStore, setCreateStore] = useState({
    storeName: "",
  });

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  console.log(stores);

  const onCreateStore = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API}/api/create-stores`,
        createStore,
        { withCredentials: true }
      );

      console.log("Form data submitted successfully:", response.data);
      setCreateStore({
        storeName: "",
      });
      fetchStores();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setCreateStore({
      storeName: value,
    });
  };

  const handleClick = async (storeId) => {
    try {
      setStoreId(storeId);
      navigate(`/inventory/${storeId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-h-screen w-screen ">
      <div className="flex items-center justify-center">
        {isLoading ? (
          "Loading..."
        ) : stores?.length < 1 ? (
          <form
            onSubmit={onCreateStore}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/2 mt-2"
          >
            <input
              onChange={handleChange}
              name="storeName"
              value={createStore.storeName}
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Store"
            />
            <button className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Create Store
            </button>
          </form>
        ) : (
          stores.map((store) => {
            return (
              <div
                key={store.storeId}
                className="border shadow-sm rounded-md py-6 px-2"
              >
                <div className="grid place-items-center">
                  <span className="font-mono">Store:</span>
                  <p className=" text-2xl font-bold ">{store.storeName}</p>
                  <span>By: {store.owner}</span>
                  <button
                    onClick={() => handleClick(store.storeId)}
                    className="px-6 py-3 bg-emerald-500 text-white font-medium rounded-lg shadow-md hover:bg-emerald-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg mt-4"
                  >
                    Go to store
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Stores;
