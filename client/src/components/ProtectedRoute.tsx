
import { Navigate } from "react-router";
import useAuth from "../hooks/authHook";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  return user ? children : <Navigate to={"/login"} replace />;
};

export default ProtectedRoute;
