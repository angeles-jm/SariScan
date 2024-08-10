import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:3000";

const Signup = () => {
  const [formData, setFormData] = useState();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API}/api/signup`, formData);

      console.log("Form data successfully submitted!");
      console.log(response.data);
    } catch (error) {
      setError(error);
      console.error(error, error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gray-50 h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center w-screen max-w-sm "
      >
        <h2 className="font-bold text-2xl">Sign Up</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email:
          </label>
          <input
            type="text"
            name="email"
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Username:
          </label>
          <input
            name="username"
            type="text"
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password:
          </label>
          <input
            name="password"
            type="password"
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="******"
          />
        </div>
        <div className="flex items-center justify-between">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Sign Up
          </button>
        </div>
        <span>
          Already have an account? <Link to={"/login"}>Signup</Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;
