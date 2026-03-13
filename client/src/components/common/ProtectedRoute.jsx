import { Navigate, Outlet, useLocation } from "react-router-dom";
import PageLoader from "./PageLoader";
import { useAuth } from "../../hooks/useAuth";
import { isAdminUser } from "../../utils/admin";

function ProtectedRoute({ adminOnly = false }) {
  const { user, bootstrapping } = useAuth();
  const location = useLocation();

  if (bootstrapping) {
    return <PageLoader label="Preparing your workspace..." />;
  }

  if (!user) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  if (adminOnly && !isAdminUser(user)) {
    return <Navigate replace to="/dashboard" />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
