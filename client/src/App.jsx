import axios from "axios";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Store from "./components/Store";
import Layout from "./layout/Layout";
import Inventory from "./pages/Inventory";
import Barcode from "./pages/Barcode";
import Login from "./pages/Login";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/barcode" element={<Barcode />} />
          <Route path="/cart" element={<Store />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
