import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const BASE_URL = "http://localhost:5001/api";
  const [auth, setAuth] = useState({ isAuthenticated: false, token: null });
  const navigate = useNavigate();

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/dashboard`, {
        withCredentials: true,
      });

      // Only update auth state if the response is valid
      if (response.data.isAuthenticated) {
        setAuth({
          isAuthenticated: true,
          token: response.data.token || null,
        });
      } else {
        setAuth({ isAuthenticated: false, token: null });
        navigate("/"); 
      }
    } catch (error) {
      setAuth({ isAuthenticated: false, token: null });
      navigate("/");
    }
  };

  // Refresh Token Function
  const refreshToken = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/refresh-token`, {
        withCredentials: true,
      });

      if (response.status === 200 && response.data.token) {
        setAuth({
          isAuthenticated: true,
          token: response.data.token,
        });
      } else {
        setAuth({ isAuthenticated: false, token: null });
        navigate("/"); // Navigate to sign-in if refresh fails
      }
    } catch (error) {
      setAuth({ isAuthenticated: false, token: null });
      navigate("/"); // Navigate to sign-in if refresh fails
    }
  };

  useEffect(() => {
    // Check auth status on initial load
    checkAuthStatus();

    // Set up token refresh interval
    const interval = setInterval(() => {
      if (auth.isAuthenticated) {
        refreshToken(); 
      }
    }, 300000); 
    return () => clearInterval(interval);
  }, []); 

  const signOut = async () => {
    try {
      await axios.get(`${BASE_URL}/logout`, { withCredentials: true });
      setAuth({ isAuthenticated: false, token: null });
      alert("You have successfully logged out");
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, signOut, refreshToken, checkAuthStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
