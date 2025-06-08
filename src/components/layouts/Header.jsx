import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { isAuthenticated } from "../../api/auth";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../context/WishlistContext";

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
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-all duration-300 ease-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 rounded-lg px-2 py-1"
            aria-label="EcoShop Home"
          >
            EcoShop
          </Link>

          {/* Desktop Search and Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <div className="relative group">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-2xl text-sm bg-gray-50/50 
                    transition-all duration-300 ease-out
                    hover:bg-white hover:border-gray-300 hover:shadow-md
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 
                    focus:bg-white focus:shadow-lg focus:scale-[1.02]
                    placeholder:text-gray-400"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  aria-label="Search products"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200">
                  <i className="fas fa-search"></i>
                </span>
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 
                      hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-red-300"
                    aria-label="Clear search"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 
                    hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  aria-label="Submit search"
                >
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>

              {isSearching && (
                <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-xl py-3 animate-in slide-in-from-top-2 duration-200">
                  <div className="p-4 text-gray-500 flex items-center space-x-2">
                    <div className="animate-spin w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full"></div>
                    <span>Searching...</span>
                  </div>
                </div>
              )}
            </form>

            <div className="flex items-center space-x-2">
              <Link
                to={isAuthenticated() ? "/account" : "/login"}
                className="p-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 
                  transition-all duration-200 ease-out transform hover:scale-110
                  focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:ring-offset-2 
                  rounded-xl relative group"
                aria-label={isAuthenticated() ? "My Account" : "Login"}
              >
                <i className="fas fa-user text-lg"></i>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 rounded-xl transition-all duration-300"></div>
              </Link>

              <Link
                to="/wishlist"
                className="p-3 text-gray-600 hover:text-red-500 hover:bg-red-50 
                  transition-all duration-200 ease-out transform hover:scale-110
                  focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:ring-offset-2 
                  rounded-xl relative group"
                aria-label="Wishlist"
              >
                <i className="fas fa-heart text-lg"></i>
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold shadow-lg animate-pulse">
                    {wishlistItems.length}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-pink-500/0 group-hover:from-red-500/10 group-hover:to-pink-500/10 rounded-xl transition-all duration-300"></div>
              </Link>

              <Link
                to="/cart"
                className="p-3 text-gray-600 hover:text-green-600 hover:bg-green-50 
                  transition-all duration-200 ease-out transform hover:scale-110
                  focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:ring-offset-2 
                  rounded-xl relative group"
                aria-label="Shopping Cart"
              >
                <i className="fas fa-shopping-cart text-lg"></i>
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold shadow-lg animate-bounce">
                    {getCartItemCount()}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-emerald-500/0 group-hover:from-green-500/10 group-hover:to-emerald-500/10 rounded-xl transition-all duration-300"></div>
              </Link>
            </div>
          </div>

          {/* Mobile Icons */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 
                transition-all duration-200 ease-out transform hover:scale-110 active:scale-95
                focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:ring-offset-2 
                rounded-xl relative group"
              aria-label="Search"
            >
              <i className={`fas ${searchOpen ? "fa-times" : "fa-search"} text-lg transition-transform duration-200 ${searchOpen ? "rotate-90" : ""}`}></i>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 rounded-xl transition-all duration-300"></div>
            </button>

            <Link
              to={isAuthenticated() ? "/account" : "/login"}
              className="p-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 
                transition-all duration-200 ease-out transform hover:scale-110 active:scale-95
                focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:ring-offset-2 
                rounded-xl relative group"
              aria-label={isAuthenticated() ? "My Account" : "Login"}
            >
              <i className="fas fa-user text-lg"></i>
            </Link>

            <Link
              to="/wishlist"
              className="p-3 text-gray-600 hover:text-red-500 hover:bg-red-50 
                transition-all duration-200 ease-out transform hover:scale-110 active:scale-95
                focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:ring-offset-2 
                rounded-xl relative group"
              aria-label="Wishlist"
            >
              <i className="fas fa-heart text-lg"></i>
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold shadow-lg animate-pulse">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="p-3 text-gray-600 hover:text-green-600 hover:bg-green-50 
                transition-all duration-200 ease-out transform hover:scale-110 active:scale-95
                focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:ring-offset-2 
                rounded-xl relative group"
              aria-label="Shopping Cart"
            >
              <i className="fas fa-shopping-cart text-lg"></i>
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold shadow-lg animate-bounce">
                  {getCartItemCount()}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search - Expandable */}
        {searchOpen && (
          <div className="mt-4 md:hidden animate-in slide-in-from-top-2 duration-300">
            <form onSubmit={handleSearchSubmit} className="relative group">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products..."
                className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-2xl text-sm bg-gray-50/50 
                  transition-all duration-300 ease-out
                  hover:bg-white hover:border-gray-300 hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 
                  focus:bg-white focus:shadow-lg
                  placeholder:text-gray-400"
                value={searchTerm}
                onChange={handleSearchInputChange}
                autoFocus
                aria-label="Search products"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200">
                <i className="fas fa-search"></i>
              </span>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 
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
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 
                  hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-gray-300"
                aria-label="Close search"
              >
                <i className="fas fa-times"></i>
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
        )}
      </div>

      {/* Navigation */}
      <Navbar />
    </header>
  );
}

export default React.memo(Header);
