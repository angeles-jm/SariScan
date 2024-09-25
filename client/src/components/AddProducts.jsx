import React, { useEffect, useState } from "react";
import { CiBarcode } from "react-icons/ci";
import BarcodeModal from "./BarcodeModal";
import useProducts from "../hooks/useProducts";
import axios from "axios";
import Alert from "@mui/material/Alert";
import { useStore } from "../context/StoreContext";

const API = "http://localhost:3000";

const AddProducts = ({ onProductAdded }) => {
  const [showModal, setShowModal] = useState(false);
  const [isBarcodeVisible, setIsBarcodeVisible] = useState(false);
  const { product, error, fetchProduct } = useProducts();
  const [formAddProduct, setFormAddProduct] = useState({
    products: {
      barcode: "",
      name: "",
      imageUrl: "",
      price: "",
    },
  });
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { storeId } = useStore();

  useEffect(() => {
    if (formError !== "") {
      const timer = setTimeout(() => setFormError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [formError]);

  useEffect(() => {
    if (product && Object.keys(product).length > 0) {
      setFormAddProduct({
        products: {
          barcode: product.barcode || "",
          name: product.brand || "",
          imageUrl: product.image_url || "",
          price: "",
        },
      });
    }
  }, [product]);

  const handleCloseBarcodeModal = () => setIsBarcodeVisible(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API}/api/stores/products/${storeId}`,
        formAddProduct,
        {
          withCredentials: true,
        }
      );
      console.log("Form data submitted successfully:", response.data);
      setFormAddProduct({
        products: { barcode: "", name: "", imageUrl: "", price: "" },
      });
      setShowModal(false);
      if (onProductAdded) {
        onProductAdded(); // Call the callback function
      }
    } catch (error) {
      setFormError(error.response?.data?.message || "An error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Changes: In the backend, it is a nested object so we had to destructure it.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormAddProduct((prevState) => ({
      products: {
        ...prevState.products,
        [name]: value,
      },
    }));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-3 bg-emerald-500 text-white font-medium rounded-lg shadow-md hover:bg-emerald-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
      >
        Add Products
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                Create New Product
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6">
              {formError && (
                <Alert severity="error" className="mb-4">
                  {formError}
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Barcode
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <input
                      required
                      type="text"
                      name="barcode"
                      value={product.barcode || formAddProduct.barcode}
                      onChange={handleChange}
                      className="flex-grow min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      placeholder="Input barcode or scan"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsBarcodeVisible(true);
                      }}
                      className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                      <CiBarcode className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={product.brand || formAddProduct.name}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    required
                    type="text"
                    name="imageUrl"
                    value={product.image_url || formAddProduct.imageUrl}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    required
                    type="number"
                    name="price"
                    value={formAddProduct.price}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full px-4 py-2 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-emerald-500 text-white hover:bg-emerald-600"
                  }`}
                >
                  {isLoading ? "Adding..." : "ADD PRODUCT"}
                </button>
              </div>
            </form>
          </div>
        </div>
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
