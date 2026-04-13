import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppContext } from "../context/useAppContext.js";
import {
  getDefaultRouteByRole,
  hasAllowedRole,
} from "../utils/routeAccess.js";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, isAuthLoading, user } = useAppContext();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasAllowedRole(user.role, allowedRoles)) {
    return <Navigate to={getDefaultRouteByRole(user.role)} replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
