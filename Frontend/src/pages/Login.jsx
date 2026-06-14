import React, { useState, useEffect } from "react";
import axios from "axios";
import { Mail, Lock, Eye, EyeOff, LogOut } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "https://internship-resume.onrender.com/api/users/login",
        form,
      );

      // SAVE TOKEN
      localStorage.setItem("token", res.data.token);

      // SAVE USER
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Dispatch custom event for sidebar to update
      window.dispatchEvent(new Event("login"));

      setIsLoggedIn(true);
      setForm({ email: "", password: "" });
      setError("");

      // REDIRECT
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // HANDLE LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    
    // Dispatch custom event for sidebar to update
    window.dispatchEvent(new Event("logout"));
    
    setError("");
    setForm({ email: "", password: "" });
    
    // Optional: Show success message
    alert("Logged out successfully!");
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center px-2 py-4 sm:px-4 sm:py-8">
      <div className="w-full p-4 max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 sm:p-8">
        
        {/* LOGOUT BUTTON - Only show when logged in */}
        {isLoggedIn && (
          <div className="mb-4 flex justify-end">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all duration-200"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        )}

        {/* HEADING */}
        <div className="mb-8 text-center">
          {isLoggedIn ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900">
                Already Logged In
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                You are currently logged in. Use the logout button above to sign out.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-sm text-gray-500 mt-2">
                Login to continue your journey
              </p>
            </>
          )}
        </div>

        {/* Only show login form if NOT logged in */}
        {!isLoggedIn ? (
          <>
            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* EMAIL */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Email
                </label>

                <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-3 focus-within:border-purple-500 transition">
                  <Mail size={18} className="text-gray-400" />

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full outline-none text-sm bg-transparent"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Password
                </label>

                <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-3 focus-within:border-purple-500 transition">
                  <Lock size={18} className="text-gray-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full outline-none text-sm bg-transparent"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                  >
                    {showPassword ? (
                      <Eye size={18} className="text-gray-400" />
                    ) : (
                      <EyeOff size={18} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium transition disabled:opacity-70 cursor-pointer"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* SIGNUP LINK */}
            <p className="text-sm text-center text-gray-500 mt-6">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-purple-600 font-semibold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </>
        ) : (
          /* Show navigation options when logged in */
          <div className="space-y-4">
            <button
              onClick={() => navigate("/")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium transition"
            >
              Go to Homepage
            </button>
            
            <button
              onClick={() => navigate("/profile")}
              className="w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 py-3 rounded-xl font-medium transition"
            >
              View Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
