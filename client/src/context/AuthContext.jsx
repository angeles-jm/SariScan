import axios from "axios";
import React, { useState, useContext, createContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cookie, removeCookie] = useCookies([]);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:3000/",
          {},
          { withCredentials: true }
        );
        if (data.status) {
          setUser(data.user);
        } else {
          setUser(null);
          removeCookie("token");
        }
      } catch (error) {
        console.error(error);
        setUser(null);
        removeCookie("token");
      }
    };

    if (cookie.token) verifyToken();
  }, [cookie.token, removeCookie]);

  const loginAction = async (email, password) => {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api",
        { email, password },
        { withCredentials: true }
      );
      if (data.status) {
        setUser(data.user);
        // setCookie("token", data.token, { path: "/" });
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logOut = () => {
    setUser(null);
    removeCookie("token");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ cookie, user, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
