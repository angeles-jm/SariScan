import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const StoreContext = createContext();

const API = "http://localhost:3000";

export const StoreProvider = ({ children }) => {
  const [stores, setStores] = useState([]);
  const [storeProductAndBarcode, setStoreProductAndBarcode] = useState([]);
  const [error, setError] = useState("");
  const [storeId, setStoreId] = useState("");
  const [productBarcode, setProductBarcode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const fetchSpecificStore = useCallback(async () => {
    if (!storeId) return;
    setIsLoading(true);
    setError("");
    try {
      const { data } = await axios.get(
        `${API}/api/stores/products/${storeId}${
          productBarcode ? `?productBarcode=${productBarcode}` : ""
        }`,
        {
          withCredentials: true,
        }
      );
      setStoreProductAndBarcode(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [storeId, productBarcode]);

  useEffect(() => {
    if (storeId) {
      fetchSpecificStore();
    }
  }, [storeId, fetchSpecificStore]);

  const clearStoreData = useCallback(() => {
    setStoreProductAndBarcode([]);
    setStoreId("");
    setProductBarcode("");
    setError("");
  }, []);

  const contextValue = useMemo(
    () => ({
      stores,
      storeProductAndBarcode,
      error,
      isLoading,
      storeId,
      productBarcode,
      setStoreId,
      setProductBarcode,
      fetchSpecificStore,
      fetchStores,
      clearStoreData,
    }),
    [
      stores,
      storeProductAndBarcode,
      error,
      isLoading,
      storeId,
      productBarcode,
      fetchSpecificStore,
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
