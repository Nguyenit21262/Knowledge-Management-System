import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useAppContext.js";

/**
 * Redirects authenticated users away from auth pages (login/register).
 * Extracted from Login.jsx and Register.jsx to avoid duplication.
 *
 * @param {string} [redirectTo="/"] – Where to redirect if already authenticated.
 */
const useAuthRedirect = (redirectTo = "/") => {
  const { isAuthenticated, isAuthLoading } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isAuthLoading, navigate, redirectTo]);
};

export default useAuthRedirect;
