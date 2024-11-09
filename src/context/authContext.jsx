import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const BASE_URL = "https://oren-assessment-6.onrender.com/api";
  const [auth, setAuth] = useState({ isAuthenticated: false });
  const navigate = useNavigate();

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/dashboard`, {
        withCredentials: true,
      });

      // Only update auth state if the response is valid
      if (response.data.isAuthenticated) {
        console.log(response.data, "Client");
        setAuth({
          isAuthenticated: true,
        });
      } else {
        setAuth({ isAuthenticated: false });
        navigate("/");
      }
    } catch (error) {
      setAuth({ isAuthenticated: false });
      navigate("/");
    }
  };

  // Refresh Token Function
  const refreshToken = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/refresh-token`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setAuth({
          isAuthenticated: true,
        });
      } else {
        setAuth({ isAuthenticated: false });
        navigate("/"); // Navigate to sign-in if refresh fails
      }
    } catch (error) {
      setAuth({ isAuthenticated: false });
      navigate("/"); // Navigate to sign-in if refresh fails
    }
  };

 
  useEffect(() => {
    // Function to handle both checkAuthStatus and refreshToken calls
    const handleAuth = async () => {
      await checkAuthStatus();

      if (auth.isAuthenticated) {
        await refreshToken();
      }
    };

    // Initial call on component mount
    handleAuth();

    // Set up interval for recurring calls
    const interval = setInterval(() => {
      handleAuth();
      console.log("Token refreshed");
    }, 240000);

    return () => clearInterval(interval); // Clean up on component unmount
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
