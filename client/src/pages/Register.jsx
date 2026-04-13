import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../context/useAppContext.js";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isAuthLoading, register, user } = useAppContext();

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
      await register(formData);
      toast.success("Account created successfully. Please login.");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.message || "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isAuthLoading, navigate, user?.role]);

  return (
    <main className="min-h-screen bg-[#f6f1eb] p-3 sm:p-6">
      <section className="flex min-h-[calc(100vh-24px)] items-center justify-center rounded-[28px] border border-[#e6ddd1] bg-[#faf6f1] px-5 py-10 shadow-[0_12px_40px_rgba(84,69,47,0.05)] sm:min-h-[calc(100vh-48px)] sm:px-8">
        <div className="w-full max-w-[386px]">
          <div className="mb-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl">
              <img
                src="/IU_icon.png"
                alt="IU icon"
                className="h-11 w-11 object-contain"
              />
            </div>

            <h1 className="mt-5 font-serif text-[2rem] font-semibold tracking-tight text-[#0f2245]">
              Create Your Account
            </h1>
            <p className="mt-2 text-[1rem] text-[#7e6f63]">
              Sign up to start learning
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="register-name"
                className="mb-2 block text-[1rem] font-semibold text-[#1f1f1f]"
              >
                Full Name
              </label>
              <input
                id="register-name"
                type="text"
                required
                value={formData.name}
                placeholder="Nguyen Van A"
                className="h-12 w-full rounded-xl border border-[#dad6d3] bg-white px-4 text-[0.98rem] text-slate-700 outline-none transition focus:border-[#243b72] focus:ring-2 focus:ring-[#243b72]/10"
                onChange={handleChange("name")}
              />
            </div>

            <div>
              <label
                htmlFor="register-email"
                className="mb-2 block text-[1rem] font-semibold text-[#1f1f1f]"
              >
                Email
              </label>
              <input
                id="register-email"
                type="email"
                required
                value={formData.email}
                placeholder="email@school.edu"
                className="h-12 w-full rounded-xl border border-[#dad6d3] bg-white px-4 text-[0.98rem] text-slate-700 outline-none transition focus:border-[#243b72] focus:ring-2 focus:ring-[#243b72]/10"
                onChange={handleChange("email")}
              />
            </div>

            <div>
              <label
                htmlFor="register-password"
                className="mb-2 block text-[1rem] font-semibold text-[#1f1f1f]"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  placeholder="At least 6 characters"
                  className="h-12 w-full rounded-xl border border-[#dad6d3] bg-white px-4 pr-12 text-[0.98rem] text-slate-700 outline-none transition focus:border-[#243b72] focus:ring-2 focus:ring-[#243b72]/10"
                  onChange={handleChange("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-[#243b72]"
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
              className="mt-2 h-12 w-full rounded-xl bg-[#243b72] text-[1.05rem] font-semibold text-white transition hover:bg-[#1d315d] focus:outline-none focus:ring-2 focus:ring-[#243b72]/20 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-8 text-center text-[1rem] text-[#7e6f63]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#243b72] transition hover:opacity-80"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;
