import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { isAuthenticated } from "../../api/auth";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../context/WishlistContext";
import { Transition } from '@headlessui/react';
import logo from "../../../public/logo.png"; // Adjust path as necessary

const criticalStyles = `
  :root {
    --header-height: 4rem;
    --nav-height: 3rem;
  }

  /* Reserve space for header */
  body {
    padding-top: calc(var(--header-height) + var(--nav-height));
  }

  /* Prevent layout shifts from icon fonts */
  .fas {
    width: 1em;
    height: 1em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  /* Ensure CountBadge has fixed dimensions */
  .count-badge {
    width: 1.5rem;
    height: 1.5rem;
    position: absolute;
  }
`;

const CountBadge = ({ count, loading, type = "default" }) => {
  const colors = {
    default: "from-indigo-500 to-purple-500",
    wishlist: "from-red-500 to-pink-500",
    cart: "from-green-500 to-emerald-500"
  };

  return (
    <span 
      className={`count-badge -top-1 -right-1 bg-gradient-to-r ${colors[type]} 
        text-white rounded-full flex items-center justify-center 
        text-xs font-semibold shadow-lg ${loading ? 'animate-pulse' : ''}`}
      aria-label={`${type} count: ${count}`}
    >
      {loading ? (
        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
      ) : (
        count
      )}
    </span>
  );
};

const LoadingSkeleton = () => (
  <div className="animate-pulse flex space-x-4 h-16 items-center">
    <div className="w-32 h-8 bg-gray-200 rounded"></div>
    <div className="flex-1 space-y-4">
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
    <div className="flex space-x-3">
      <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
      <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
      <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
    </div>
  </div>
);

function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const { getCartItemCount } = useCart();
  const { wishlistItems = [] } = useWishlist();

  // Focus input when search is opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
      setSearchTerm("");
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchTerm("");
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
  <div className="container mx-auto px-4 min-h-16">
    <div className="grid grid-cols-12 gap-4 h-16">
      <div className="col-span-3 flex items-center">
        <Link to="/" aria-label="EcoShop Home">  <img src={logo} alt="EcoShop Logo" className="h-20" /></Link>
      </div>

      <div className="col-span-9 flex justify-end items-center">
        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-4">
          <form onSubmit={handleSearchSubmit} className="w-full relative group">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              aria-label="Search products"
              className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-2xl text-sm bg-gray-50/50 
                transition-all duration-300 ease-out hover:bg-white hover:border-gray-300 hover:shadow-md
                focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 
                focus:bg-white focus:shadow-lg focus:scale-[1.02] placeholder:text-gray-400"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200">
              <i className="fas fa-search"></i>
            </span>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-gray-400 
                  hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-red-300"
                aria-label="Clear search"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 
                hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-indigo-300"
              aria-label="Submit search"
            >
              <i className="fas fa-arrow-right"></i>
            </button>

            {isSearching && (
              <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-xl py-3 animate-in slide-in-from-top-2 duration-200">
                <div className="p-4 text-gray-500 flex items-center space-x-2">
                  <div className="animate-spin w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full"></div>
                  <span>Searching...</span>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-2 w-auto">
          {/* Account */}
          <Link
            to={isAuthenticated() ? "/account" : "/login"}
            aria-label={isAuthenticated() ? "My Account" : "Login"}
            className="p-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 
              transition-all duration-200 transform hover:scale-110
              focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:ring-offset-2 
              rounded-xl relative group"
          >
            <i className="fas fa-user text-lg"></i>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 rounded-xl transition-all duration-300"></div>
          </Link>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="p-3 text-gray-600 hover:text-red-500 hover:bg-red-50 
              transition-all duration-200 transform hover:scale-110
              focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:ring-offset-2 
              rounded-xl relative group"
          >
            {wishlistItems.length > 0 && (
              <CountBadge count={wishlistItems.length} type="wishlist" />
            )}
            <i className="fas fa-heart text-lg"></i>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-pink-500/0 group-hover:from-red-500/10 group-hover:to-pink-500/10 rounded-xl transition-all duration-300"></div>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            aria-label="Shopping Cart"
            className="p-3 text-gray-600 hover:text-green-600 hover:bg-green-50 
              transition-all duration-200 transform hover:scale-110
              focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:ring-offset-2 
              rounded-xl relative group"
          >
            {getCartItemCount() > 0 && (
              <CountBadge count={getCartItemCount()} type="cart" />
            )}
            <i className="fas fa-shopping-cart text-lg"></i>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-emerald-500/0 group-hover:from-green-500/10 group-hover:to-emerald-500/10 rounded-xl transition-all duration-300"></div>
          </Link>
        </div>
      </div>
    </div>

    {/* Mobile Search */}
    <Transition
      show={searchOpen}
      enter="transition-all duration-300 ease-out"
      enterFrom="opacity-0 -translate-y-4"
      enterTo="opacity-100 translate-y-0"
      leave="transition-all duration-200 ease-in"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 -translate-y-4"
      className="md:hidden"
    >
      <div className="py-2">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchInputChange}
            aria-label="Search products"
            autoFocus
            className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-2xl text-sm bg-gray-50/50 
              transition-all duration-300 ease-out hover:bg-white hover:border-gray-300 hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 
              focus:bg-white focus:shadow-lg placeholder:text-gray-400"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <i className="fas fa-search"></i>
          </span>
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-gray-400 
                hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-red-300"
              aria-label="Clear search"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
          <button
            type="button"
            onClick={closeSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 
              hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Close search"
          >
            <i className="fas fa-times"></i>
          </button>
        </form>
      </div>
    </Transition>
    </div>

  <div className="h-12">
    <Navbar />
  </div>
</header>

  );
}

export default React.memo(Header);
