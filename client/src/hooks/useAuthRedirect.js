import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useAppContext.js";
import { getDefaultRouteByRole } from "../utils/routeAccess.js";

/**
 * Redirect authenticated users away from login/register pages.
 *
 * @param {string} [redirectTo] Optional override for the post-auth redirect path.
 */
const useAuthRedirect = (redirectTo) => {
  const { isAuthenticated, isAuthLoading, user } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      navigate(redirectTo || getDefaultRouteByRole(user?.role), {
        replace: true,
      });
    }
  }, [isAuthenticated, isAuthLoading, navigate, redirectTo, user?.role]);
};

export default useAuthRedirect;
