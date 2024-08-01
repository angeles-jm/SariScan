import React, { useEffect, useState } from "react";
import { CiBarcode } from "react-icons/ci";
import BarcodeModal from "./BarcodeModal";
import useProducts from "../hooks/useProducts";
import axios from "axios";

import Alert from "@mui/material/Alert";

const API = "http://localhost:3000";

const AddProducts = () => {
  const [showModal, setShowModal] = useState(false);
  const [isBarcodeVisible, setIsBarcodeVisible] = useState(false);
  const { product, error, fetchProduct } = useProducts();
  const [formAddProduct, setFormAddProduct] = useState();
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (formError !== "") {
      const timer = setTimeout(() => {
        setFormError("");
      }, 5000); // Change 5000 to your desired timeout duration in milliseconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount or when formError changes
    }
  }, [formError]);

  // useEffect so we can automatically populate the value for barcode, name, image, if there is.
  // If there is no value, the value will be the user Input
  useEffect(() => {
    setFormAddProduct({
      barcode: product.barcode || "",
      name: product.brand || "",
      imageUrl: product.image_url || "",
      price: "",
    });
  }, [product]);

  const handleCloseBarcodeModal = () => setIsBarcodeVisible(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API}/api/products`, formAddProduct);

      console.log("Form data submitted successfully:", response.data);
      setFormAddProduct({
        barcode: "",
        name: "",
        imageUrl: "",
        price: "",
      });
    } catch (error) {
      // if (error.response.status) {
      // }

      setFormError(error.response.data.message);
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormAddProduct({ ...formAddProduct, [name]: value });
  };

  return (
    <div>
      <button
        onClick={() => setShowModal(!showModal)}
        className="block text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm py-2 px-3 text-center dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        Add Products
      </button>

      {showModal ? (
        <div className="flex overflow-y-auto  fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-[calc(100%-1rem)] max-h-full transition-transform">
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Create New Product
                </h3>
                <button
                  onClick={() => setShowModal(!showModal)}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-toggle="crud-modal"
                >
                  <span className="hover:font-bold">x</span>
                </button>
              </div>
              {/* Content */}

              <form className="p-4 md:p-5" onSubmit={handleFormSubmit}>
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    {formError !== "" ? (
                      <Alert severity="error" className="mb-2">
                        {formError}
                      </Alert>
                    ) : (
                      ""
                    )}

                    <label className="block mb-2 text-sm font-medium">
                      Barcode
                    </label>
                    <div className="flex rounded-lg shadow-sm">
                      <input
                        required
                        type="text"
                        value={product.barcode || formAddProduct.barcode}
                        name="barcode"
                        onChange={handleChange}
                        className="bg-gray-50 border rounded-s-md border-gray-300 text-gray-900 text-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                        placeholder="Input barcode or scan the barcode"
                      />{" "}
                      <button
                        className="w-[3.5rem] shrink-0 inline-flex justify-center items-center rounded-e-md border border-transparent bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:bg-green-700 disabled:opacity-50 disabled:pointer-events-none text-4xl"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsBarcodeVisible(true);
                        }}
                      >
                        <CiBarcode />
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block mb-2 text-sm font-medium">
                      Name
                    </label>
                    <input
                      required
                      type="text"
                      value={product.brand || formAddProduct.name}
                      name="name"
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-2 text-sm font-medium">
                      Image URL:
                    </label>
                    <input
                      required
                      type="text"
                      value={product.image_url || formAddProduct.imageUrl}
                      name="imageUrl"
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-2 text-sm font-medium ">
                      Price
                    </label>
                    <input
                      required
                      type="number"
                      name="price"
                      value={formAddProduct.price || ""}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    />
                  </div>
                </div>
                <button className=" block text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm py-2 px-3 text-center dark:hover:bg-green-700 dark:focus:ring-green-800">
                  ADD PRODUCT
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {isBarcodeVisible && (
        <BarcodeModal
          onClose={handleCloseBarcodeModal}
          product={product}
          error={error}
          fetchProduct={fetchProduct}
        />
      )}
    </div>
  );
};

export default AddProducts;
