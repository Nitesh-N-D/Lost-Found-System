import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function PublicRoute() {
  const { user, bootstrapping } = useAuth();

  if (bootstrapping) return null;

  return user ? <Navigate replace to="/dashboard" /> : <Outlet />;
}

export default PublicRoute;
