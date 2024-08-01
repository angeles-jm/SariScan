import axios from "axios";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Store from "./components/Store";
import Navbar from "./components/Navbar";
import Inventory from "./pages/Inventory";
import Barcode from "./pages/Barcode";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inventory />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/barcode" element={<Barcode />} />
        <Route path="/cart" element={<Store />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
