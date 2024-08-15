import React from "react";
import { MdAddShoppingCart, MdOutlineInventory2 } from "react-icons/md";
import { CiBarcode } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import { useStore } from "../context/StoreContext";

const Navbar = () => {
  const { storeId } = useStore();

  const data = [
    {
      id: 1,
      name: "Inventory",
      link: `/inventory/${storeId}`,
      icon: <MdOutlineInventory2 className="text-xl" />,
    },
    {
      id: 2,
      name: "Cart",
      link: "/cart",
      icon: <MdAddShoppingCart className="text-xl" />,
    },
    {
      id: 3,
      name: "Barcode",
      link: "/barcode",
      icon: <CiBarcode className="text-xl" />,
    },
  ];

  return (
    <nav className="bg-emerald-500 shadow-md">
      <div className="container mx-auto">
        <div className="flex justify-around items-center py-3">
          {data.map((item) => (
            <NavLink
              to={item.link}
              key={item.id}
              className={({ isActive }) =>
                `flex items-center rounded-lg gap-2 px-4 py-2 transition-colors duration-300 ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "text-emerald-100 hover:bg-emerald-600 hover:text-white"
                }`
              }
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
