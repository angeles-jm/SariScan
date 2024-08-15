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

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleClick = async (storeId) => {
    try {
      setStoreId(storeId);
      navigate(`/inventory/${storeId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-h-screen w-screen  ">
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {isLoading
          ? "Loading..."
          : stores?.length === 0
          ? "Create a store blah blah"
          : stores.map((store) => {
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
            })}
      </div>
    </div>
  );
};

export default Stores;
