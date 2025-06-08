import React, { useState ,useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Adjust the import path as necessary
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../context/WishlistContext";
import Swal from "sweetalert2";

function Loginforms() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [resetPassword, setResetPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { fetchCartData, mergeWithUserCart } = useCart();
  const { refreshWishlist } = useWishlist();
  const { login } = useAuth(); // Assuming useAuth provides a login function

  useEffect(() => {
    // Jab bhi path change ho, check karo
    const allowedPaths = ["/login", "/account"];
    if (allowedPaths.includes(location.pathname)) {
      setResetPassword(true);
    } else {
      setResetPassword(false);
    }
  }, [location.pathname]);
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Perform login
      await login(email, password);

      // After successful login, update cart and wishlist
      try {
        // Merge guest cart with customer cart if exists
        await mergeWithUserCart();

        // Refresh cart and wishlist data
        await Promise.all([fetchCartData(), refreshWishlist()]);

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "You have been logged in successfully!",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          const from = location.state?.from || "/account";
          navigate(from, { replace: true });
        });
      } catch (syncError) {
        console.error("Error syncing user data:", syncError);
        // Still proceed with navigation even if sync fails
        const from = location.state?.from || "/account";
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Invalid email or password. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="your@email.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-700"
          >
            Remember me
          </label>
        </div>
        {resetPassword && (
          <div className="text-sm">
            <Link
              to="/resetpassword"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Reset Password
            </Link>
          </div>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </button>
      </div>
    </form>
  );
}

export default React.memo(Loginforms);
