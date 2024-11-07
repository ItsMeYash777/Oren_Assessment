import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;
