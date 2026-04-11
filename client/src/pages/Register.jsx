import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Mocking the registration process
        console.log("Registering user:", formData);

        // Simulate a short delay like a real API call
        toast.loading("Creating account...", { duration: 1000 });

        setTimeout(() => {
            toast.success("Registration successful! Please log in.");
            navigate("/login");
        }, 1000);

        // try {
        //     const res = await fetch("http://localhost:5000/api/auth/register", {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify(formData),
        //     });

        //     const data = await res.json();

        //     if (res.ok) {
        //         toast.success("Registration successful! Please log in.");
        //         navigate("/login");
        //     } else {
        //         toast.error(data.message || "Registration failed");
        //     }
        // } catch (error) {
        //     toast.error("Connection error");
        // }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <h2 className="mb-6 text-center text-3xl font-bold text-slate-800">Sign Up</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Full Name</label>
                        <input
                            type="text"
                            required
                            className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
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
                    <button type="submit" className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 transition">
                        Create Account
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-slate-600">
                    Already have an account? <Link to="/login" className="text-green-600 hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;