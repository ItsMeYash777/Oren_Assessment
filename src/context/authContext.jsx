import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const BASE_URL = "https://oren-assessment-6.onrender.com/api";
  const [auth, setAuth] = useState({ isAuthenticated: false });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/check-session`, {
        withCredentials: true
      });
      if (response.data.isAuthenticated) {
        console.log(response.data, "Client");
        setAuth({
          isAuthenticated: true,
          user: response.data.user,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.log("Auth check failed", error);
      return false;
    }finally{
      setIsLoading(false);
    }
  };
  const refreshToken = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/refresh-token`, {
        withCredentials: true,
      });
      return response.data.isAuthenticated;
    } catch (error) {
      console.log("Refresh token failed", error); 
    }
  };

 
  useEffect(() => { 
    const handleAuth = async () => {
      try {
        const isValid = await checkAuthStatus();
        if (!isValid) {
          const refreshed = await refreshToken();
          if (!refreshed) {
            setAuth({ isAuthenticated: false });
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Auth handling failed:", error);
        setAuth({ isAuthenticated: false });
        navigate("/");
      }
    };
    handleAuth();
    const interval = setInterval(refreshToken, 45 * 60 * 1000);
    return () => clearInterval(interval); 
  }, [navigate]);

  const signOut = async () => {
    try {
      await axios.get(`${BASE_URL}/logout`, { withCredentials: true , credentials : "include" });
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
