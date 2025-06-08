import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Swal from "sweetalert2";


function CustomerRegisteredForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(null);
    const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setLoading(true); // Start loading spinner if any

    // Frontend validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setFormError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (!formData.email.includes("@")) {
      setFormError("Enter a valid email address.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!formData.agree) {
      setFormError("You must agree to the terms.");
      setLoading(false);
      return;
    }
    try {
      // Send form data to backend
      const token = await register(formData); // You should define and import `register`

      if (token) {
        Swal.fire(
          "Registration Successful",
          "Redirecting to login page",
          "success"
        ).then(() => {
          navigate("/login");
        });
      } else {
        setFormError("Registration failed.");
        Swal.fire("Failed", "Could not register user.", "error");
      }
    } catch (error) {
      console.error("Registration error:", error);

      let message = "Something went wrong. Please try again.";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }

      setFormError(message);
      Swal.fire("Error", message, "error");
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <>
      {formError && <p className="text-red-600 mb-4">{formError}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            id="firstNameme"
            name="firstName"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="Enetr your name"
            required
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="Enetr your name"
            required
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="your@email.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="••••••••"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="••••••••"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="agree"
              className="mr-2"
              required
              checked={formData.agree}
              onChange={handleChange}
            />
            <span className="text-gray-700 text-sm">
              I agree to the{" "}
              <a href="#" className="text-indigo-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-indigo-600 hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded font-medium hover:bg-indigo-700 transition"
        >
          Create Account
        </button>
      </form>
    </>
  );
}

export default React.memo(CustomerRegisteredForm);
