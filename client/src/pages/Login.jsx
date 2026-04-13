import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../context/useAppContext.js";
import useAuthRedirect from "../hooks/useAuthRedirect.js";
import {
  getDefaultRouteByRole,
  hasAllowedRole,
} from "../utils/routeAccess.js";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAppContext();
  useAuthRedirect();

  const handleChange = (field) => (event) => {
    setFormData((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const loggedInUser = await login(formData);
      toast.success("Signed in successfully.");
      const redirectPath = location.state?.from?.pathname;
      const canAccessRedirectPath =
        redirectPath &&
        (!redirectPath.startsWith("/admin") ||
          hasAllowedRole(loggedInUser?.role, ["teacher"]));

      navigate(
        canAccessRedirectPath
          ? redirectPath
          : getDefaultRouteByRole(loggedInUser?.role),
        { replace: true },
      );
    } catch (error) {
      toast.error(error.message || "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <main className="min-h-screen bg-[#f6f9ff] p-3 sm:p-6">
      <section className="flex min-h-[calc(100vh-24px)] items-center justify-center rounded-[28px] border border-[#e2e8f0] bg-[#ffffff] px-5 py-10 shadow-[0_12px_40px_rgba(84,69,47,0.05)] sm:min-h-[calc(100vh-48px)] sm:px-8">
        <div className="w-full max-w-[386px]">
          <div className="mb-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl">
              <img
                src="/IU_icon.png"
                alt="IU icon"
                className="h-11 w-11 object-contain"
              />
            </div>

            <h1 className="mt-5 font-serif text-[2rem] font-semibold tracking-tight text-[#0f172a]">
              Sign In to Learning Hub
            </h1>
            <p className="mt-2 text-[1rem] text-[#64748b]">
              Welcome back to your learning space
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="mb-2 block text-[1rem] font-semibold text-[#1f1f1f]"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={formData.email}
                placeholder="email@school.edu"
                className="h-12 w-full rounded-xl border border-[#dad6d3] bg-white px-4 text-[0.98rem] text-slate-700 outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/10"
                onChange={handleChange("email")}
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-2 block text-[1rem] font-semibold text-[#1f1f1f]"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-xl border border-[#dad6d3] bg-white px-4 pr-12 text-[0.98rem] text-slate-700 outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/10"
                  onChange={handleChange("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-[#3b82f6]"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-[18px] w-[18px]" strokeWidth={1.8} />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" strokeWidth={1.8} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 h-12 w-full rounded-xl bg-[#3b82f6] text-[1.05rem] font-semibold text-white transition hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-[1rem] text-[#64748b]">
            Do not have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#3b82f6] transition hover:opacity-80"
            >
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;
