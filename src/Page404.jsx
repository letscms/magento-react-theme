import React from "react";
import { Link } from "react-router-dom"; // Optional: only if using React Router

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
      <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-6">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
