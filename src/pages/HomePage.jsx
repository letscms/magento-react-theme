import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Herobanner from "../utils/Herobanner";
import CategoryCard from "../components/category/CategoryCard";
import ProductCard from "../components/product/ProductCard";
import Featurebox from "../utils/Featurebox";
import { useCategory } from "../context/CategoryContext";
import Loader from "../utils/Loader";
import { useProduct } from "../hooks/useProduct";
import Seo from "../components/Seo/seo";

function HomePage() {
  const {
    getAllCategories,
    loading: categoryLoading,
    error: categoryError,
    initialized,
  } = useCategory();
  const { getProducts, loading: productLoading, error: productError } = useProduct();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState({ items: [] });
  const [localLoading, setLocalLoading] = useState(!initialized);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLocalLoading(true);
        const categoriesData = await getAllCategories();
        const productsData = await getProducts();
        setCategories(categoriesData || []);
        setProducts(productsData || { items: [] });
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLocalLoading(false);
      }
    };

    if (!initialized || !categories.length) {
      fetchData();
    }
  }, [initialized, getAllCategories, getProducts, categories.length]);

  const isLoading = categoryLoading || productLoading || localLoading;
  const error = categoryError || productError;

  const banners = [
    {
      title: "Trendy New Arrivals",
      subtitle: "Explore the latest fashion and lifestyle collections!",
      buttonText: "Shop Now",
      buttonLink: "/new-arrivals",
      image: "https://source.unsplash.com/1600x600/?fashion,clothing",
      mobileImage: "https://source.unsplash.com/800x600/?fashion,clothing",
      bg: "bg-gradient-to-r from-pink-500 via-red-400 to-orange-400",
    },
    {
      title: "Big Billion Sale",
      subtitle: "Up to 80% off on top brands – shop before it’s gone!",
      buttonText: "Grab Deals",
      buttonLink: "/sale",
      image: "https://source.unsplash.com/1600x600/?sale,fashion",
      mobileImage: "https://source.unsplash.com/800x600/?sale,fashion",
      bg: "bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500",
    },
    {
      title: "Curated for You",
      subtitle: "Discover fashion, accessories, and home essentials.",
      buttonText: "Explore Now",
      buttonLink: "/categories",
      image: "https://source.unsplash.com/1600x600/?lifestyle,shopping",
      mobileImage: "https://source.unsplash.com/800x600/?lifestyle,shopping",
      bg: "bg-gradient-to-r from-green-400 via-teal-400 to-blue-400",
    },
  ];

  const features = [
    {
      icon: "fas fa-truck",
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
      title: "Free Shipping",
      description: "On orders over $50",
    },
    {
      icon: "fas fa-undo",
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
      title: "Easy Returns",
      description: "Hassle-free 30-day returns",
    },
    {
      icon: "fas fa-tags",
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
      title: "Exclusive Deals",
      description: "Daily discounts & offers",
    },
    {
      icon: "fas fa-headset",
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
      title: "24/7 Support",
      description: "Instant customer help",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Seo
        title="LetsCMS - Online Fashion & Lifestyle Store"
        description="Shop trendy fashion, accessories, and lifestyle products at LetsCMS with exclusive deals and fast delivery."
        keywords="ecommerce, fashion, clothing, accessories, deals, online shopping"
      />

      {/* Hero Banner */}
      <Herobanner banners={banners} />

      {/* Top Deals Section (Myntra/Meesho-inspired) */}
      <section className="py-6 sm:py-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-center text-gray-800">
            Top Deals of the Day
          </h2>
          {isLoading ? (
            <div className="flex justify-center py-6 sm:py-8">
              <Loader />
            </div>
          ) : productError ? (
            <div className="text-center py-4 sm:py-6 text-red-600 bg-red-50 rounded-lg shadow-sm text-sm sm:text-base">
              {productError}
            </div>
          ) : products.items.length === 0 ? (
            <div className="text-center py-4 sm:py-6 text-gray-600 bg-gray-100 rounded-lg shadow-sm text-sm sm:text-base">
              No deals available
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              {products.items.slice(0, 10).map((product, index) => (
                <ProductCard
                  key={product.id || `deal-${index}`}
                  product={product}
                  isLCPCandidate={index === 0}
                />
              ))}
            </div>
          )}
          
        </div>
      </section>

     {/* Categories Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800 relative">
            <span className="inline-block relative">
              Shop by Category
              
            </span>
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600 bg-red-50 rounded-lg shadow-sm">
              {error}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-gray-600 bg-gray-100 rounded-lg shadow-sm">
              No categories found
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl shadow-sm overflow-hidden">
              <CategoryCard CategoryCardinfo={categories} />
            </div>
          )}
        </div>
      </section>  

      {/* Trending Products Section */}
      <section className="py-6 sm:py-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-center text-gray-800">
            Trending Now
          </h2>
          {isLoading ? (
            <div className="flex justify-center py-6 sm:py-8">
              <Loader />
            </div>
          ) : productError ? (
            <div className="text-center py-4 sm:py-6 text-red-600 bg-red-50 rounded-lg shadow-sm text-sm sm:text-base">
              {productError}
            </div>
          ) : products.items.length === 0 ? (
            <div className="text-center py-4 sm:py-6 text-gray-600 bg-gray-100 rounded-lg shadow-sm text-sm sm:text-base">
              No trending products available
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              {products.items.slice(0, 10).map((product, index) => (
                <ProductCard
                  key={product.id || `trending-${index}`}
                  product={product}
                  isLCPCandidate={index === 0}
                />
              ))}
            </div>
          )}
         
        </div>
      </section>

      {/* Features Section */}
      <section className="py-6 sm:py-8 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-center text-gray-800">
            Why Shop With Us
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <Featurebox features={features} />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-6 sm:py-8 bg-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">
              Join Our Fashion Community
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
              Get exclusive offers, style tips, and updates on new arrivals.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 sm:px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-grow w-full text-sm sm:text-base"
              />
              <button className="bg-pink-500 text-white px-3 sm:px-4 py-2 rounded-full font-medium hover:bg-pink-600 transition-colors duration-300 shadow-sm text-sm sm:text-base">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;