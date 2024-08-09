import React from "react";
import { Barcode, Package, Calculator } from "lucide-react";
import { Link } from "react-router-dom";

const Feature = ({ icon: Icon, title }) => (
  <div className="flex items-center space-x-2">
    <Icon className="h-5 w-5 text-indigo-500" />
    <span className="text-sm font-medium text-gray-700">{title}</span>
  </div>
);

const Homepage = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col h-full">
        <div className="flex-grow flex flex-col justify-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-900">
            <span className="block">Manage Your Store with</span>
            <span className="block text-indigo-600">SariScan</span>
          </h1>
          <p className="mt-3 text-xl text-center text-gray-500 max-w-2xl mx-auto">
            Simplify inventory, pricing, and sales with our powerful barcode
            scanning app.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              to="/login"
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 ease-in-out"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3">
          <Feature icon={Barcode} title="Barcode Scanning" />
          <Feature icon={Package} title="Inventory Management" />
          <Feature icon={Calculator} title="Product Computation" />
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Designed for small business owners to streamline operations and
            boost efficiency.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Homepage;
