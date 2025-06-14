import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Layout Components
import MainLayout from "../components/layouts/MainLayout";

// Utility
import { isAuthenticated } from "../api/auth";
import "../styles/App.css";
import LoadingSpinner from "../components/ui/LoadingSpinner";

// Lazy-loaded Page Components
const HomePage = lazy(() => import("../pages/HomePage"));
const Login = lazy(() => import("../pages/Login"));
const AccountPage = lazy(() => import("../pages/AccountPage"));
const ProductDetailPage = lazy(() => import("../pages/ProductDetailPage"));
const FeaturedProducts = lazy(() => import("../pages/FeaturedProducts"));
const CategoryProductListing = lazy(() => import("../pages/CategoryPage"));
const Cart = lazy(() => import("../pages/Cart"));
const Checkout = lazy(() => import("../pages/Checkout"));
const SearchResults = lazy(() => import("../pages/SearchResults"));
const WishlistPage = lazy(() => import("../pages/WishlistPage"));
const Page404 = lazy(() => import("../Page404"));
const Faqs = lazy(() => import("../pages/Faqs"));
const ShippingReturns = lazy(() => import("../pages/ShippingReturns"));
const PrivacyPolicyPage = lazy(() => import("../pages/PrivacyPolicyPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));

// Account Sub-Sections
import Dashboard from "../components/account/Dashboard";
import Orders from "../components/account/Orders";
import OrderDetail from "../components/account/OrderDetail";
import AccountAddresses from "../components/account/AccountAddresses";
import Myaccount from "../components/account/Myaccount";
import RequestPasswordResetForm from "../components/forms/RequestPasswordResetForm";

// Placeholder Components
const AccountReviews = () => <div className="p-6 text-lg">Reviews Page</div>;

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  return isAuthenticated() ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

// Main Routing Component
function AppRoutes() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/reset-password" element={<RequestPasswordResetForm />} />
        <Route path="/categorypage" element={<MainLayout><FeaturedProducts /></MainLayout>} />
        <Route path="/category/:slug" element={<MainLayout><CategoryProductListing /></MainLayout>} />
        <Route path="/product/:urlKey" element={<MainLayout><ProductDetailPage /></MainLayout>} />
        <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
        <Route path="/checkout" element={<MainLayout><Checkout /></MainLayout>} />
        <Route path="/search" element={<MainLayout><SearchResults /></MainLayout>} />
        <Route path="/faq" element={<MainLayout><Faqs /></MainLayout>} />
        <Route path="/shipping-returns" element={<MainLayout><ShippingReturns /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
        <Route path="/privacy-policy" element={<MainLayout><PrivacyPolicyPage /></MainLayout>} />

        {/* Protected Account Routes */}
        <Route path="/account" element={<ProtectedRoute><MainLayout><AccountPage /></MainLayout></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="orders">
            <Route index element={<Orders />} />
            <Route path=":orderId" element={<OrderDetail />} />
          </Route>
          <Route path="addresses" element={<AccountAddresses />} />
          <Route path="edit" element={<Myaccount />} />
          <Route path="reviews" element={<AccountReviews />} />
        </Route>

        {/* Protected Wishlist */}
        <Route path="/wishlist" element={<ProtectedRoute><MainLayout><WishlistPage /></MainLayout></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<MainLayout><Page404 /></MainLayout>} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;