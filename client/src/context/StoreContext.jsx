import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

const StoreContext = createContext();

const API = "http://localhost:3000";

export const StoreProvider = ({ children }) => {
  const [stores, setStores] = useState([]);
  const [storeProducts, setStoreProducts] = useState([]);
  const [scannedProducts, setScannedProducts] = useState([]);
  const [error, setError] = useState("");
  const [storeId, setStoreId] = useState("");
  const [productBarcode, setProductBarcode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`${API}/api/get-stores`, {
        withCredentials: true,
      });
      setStores(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const fetchAllStoreProducts = useCallback(async () => {
    if (!storeId) return;
    setIsLoading(true);
    setError("");
    try {
      const { data } = await axios.get(
        `${API}/api/stores/products/${storeId}`,
        {
          withCredentials: true,
        }
      );
      setStoreProducts(data);
    } catch (error) {
      setError(error.message);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [storeId]);

  const fetchScannedProduct = useCallback(async () => {
    if (!storeId || !productBarcode) {
      console.log("Missing storeId or productBarcode", {
        storeId,
        productBarcode,
      });
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      console.log("Fetching scanned product...");
      const { data } = await axios.get(
        `${API}/api/stores/product-barcode/${storeId}?productBarcode=${productBarcode}`,
        {
          withCredentials: true,
        }
      );
      console.log("API response:", data);
      if (data && data.products) {
        setScannedProducts((prevProducts) => [...prevProducts, data.products]);
        console.log("Updated scannedProducts:", data.products);
      } else {
        console.log("No products found in the API response");
        setError("Product not found");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching scanned product:", error);
    } finally {
      setIsLoading(false);
      setProductBarcode(""); // Clear the barcode after each scan
    }
  }, [storeId, productBarcode]);

  useEffect(() => {
    if (storeId && productBarcode) {
      console.log("Barcode updated: ", productBarcode); // Add this to log barcode state
      fetchScannedProduct();
    }
  }, [storeId, productBarcode, fetchScannedProduct]);

  useEffect(() => {
    if (storeId) {
      fetchAllStoreProducts();
    }
  }, [storeId, fetchAllStoreProducts]);

  const clearStoreData = useCallback(() => {
    setStoreProducts([]);
    setScannedProducts([]);
    setStoreId("");
    setProductBarcode("");
    setError("");
  }, []);

  const contextValue = useMemo(
    () => ({
      stores,
      storeProducts,
      scannedProducts,
      error,
      isLoading,
      storeId,
      productBarcode,
      setStoreId,
      setProductBarcode,
      fetchAllStoreProducts,
      fetchScannedProduct,
      fetchStores,
      clearStoreData,
    }),
    [
      stores,
      storeProducts,
      scannedProducts,
      error,
      isLoading,
      storeId,
      productBarcode,
      fetchAllStoreProducts,
      fetchScannedProduct,
      fetchStores,
      clearStoreData,
    ]
  );

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
