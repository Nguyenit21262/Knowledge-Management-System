import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Mock notification to check UI logic
        console.log("Login form data:", formData);

        if (formData.email === "admin@gmail.com" && formData.password === "123456") {
            toast.success("Mock login successful!");
            navigate("/"); // Redirect to home layout
        } else {
            toast.error("Try using admin@gmail.com and 123456!");
        }

        /* // Actual API implementation when backend is ready:
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Login successful!");
                localStorage.setItem("token", data.token);
                navigate("/");
            } else {
                toast.error(data.message || "Login failed");
            }
        } catch (error) {
            toast.error("Could not connect to server");
        }
        */
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <h2 className="mb-6 text-center text-3xl font-bold text-slate-800">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="name@gmail.com"
                            className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Password</label>
                        <input
                            type="password"
                            required
                            className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition">
                        Sign In
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-slate-600">
                    Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register now</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;