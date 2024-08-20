import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import PrivateRoute from "./components/auth/PrivateRoute";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Inventory from "./pages/Inventory";
import Barcode from "./pages/Barcode";
import Store from "./components/Store";
import Layout from "./layout/Layout";
import Stores from "./pages/Stores";
import { StoreProvider } from "./context/StoreContext";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StoreProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/home" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Private routes */}
            <Route element={<Layout />}>
              <Route element={<PrivateRoute />}>
                <Route index element={<Navigate to="/inventory" replace />} />
                <Route path="stores" element={<Stores />} />
                <Route path="inventory/:storeId" element={<Inventory />} />
                <Route path="barcode" element={<Barcode />} />
                <Route path="cart" element={<Store />} />
              </Route>
            </Route>

            {/* Catch-all route for 404 */}
            <Route path="*" element={<h1>Page not found</h1>} />
          </Routes>
        </StoreProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
