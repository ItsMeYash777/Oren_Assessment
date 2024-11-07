
import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    token: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setAuth({ isAuthenticated: true, token });
    }
  }, []);

  const signOut = () => {
    localStorage.removeItem("jwtToken");
    setAuth({ isAuthenticated: false, token: null });
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, 
};

export const useAuth = () => useContext(AuthContext);
