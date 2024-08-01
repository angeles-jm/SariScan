import React, { useState } from "react";
import {
  MdAddShoppingCart,
  MdBarcodeReader,
  MdOutlineInventory2,
} from "react-icons/md";

import { CiBarcode } from "react-icons/ci";
import { Link, NavLink } from "react-router-dom";

const data = [
  {
    id: 1,
    name: "Inventory",
    link: "/inventory",
    icon: <MdOutlineInventory2 />,
  },
  { id: 2, name: "Cart", link: "/cart", icon: <MdAddShoppingCart /> },
  { id: 3, name: "Barcode", link: "/barcode", icon: <CiBarcode /> },
];

const Navbar = () => {
  return (
    <nav className="overflow-hidden relative flex justify-around items-center py-3 bg-green-300">
      {data.map((item) => (
        <NavLink
          to={item.link}
          key={item.id}
          className={({ isActive }) =>
            isActive
              ? "flex items-center rounded-lg gap-2 bg-green-400 transition p-2"
              : "flex items-center rounded-lg gap-2 hover:bg-green-400 transition p-2"
          }
        >
          <div className="flex items-center">
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </div>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navbar;
