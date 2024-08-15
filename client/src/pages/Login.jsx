import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:3000";

const Login = () => {
  const navigate = useNavigate();
  const { user, loginAction } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/stores");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${API}/api/login`, formData, {
        withCredentials: true,
      });

      console.log("Form data successfully submitted!");

      const { success, message, token } = response.data;

      if (success) {
        // Use loginAction to update the global auth state
        const loginSuccess = await loginAction(token);
        loginSuccess
          ? navigate("/stores")
          : setError("Failed to update login state. Please try again.");
      } else {
        setError(message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      setError("An error occurred during login. Please try again.");
      console.error(error, error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gray-50 h-screen ">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center w-screen max-w-sm "
      >
        <h2 className="font-bold text-2xl mb-4">Sign In</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4 w-full">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Username:
          </label>
          <input
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4 w-full">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password:
          </label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="******"
          />
        </div>
        <div className="flex items-center justify-between mb-4">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Sign In
          </button>
        </div>
        <span>
          Don't have an account? <Link to={"/signup"}>Signup</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
