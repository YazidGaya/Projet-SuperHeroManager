import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Chargement...</p>;

  return user ? children : <Navigate to="/" />;
}

export default PrivateRoute;
