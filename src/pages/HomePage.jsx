import React, { useState, useEffect } from "react";
import Herobanner from "../utils/Herobanner";
import CategoryCard from "../components/category/CategoryCard";
import ProductCard from "../components/product/ProductCard";
import Featurebox from "../utils/Featurebox";
import { useCategory } from "../context/CategoryContext";
import Loader from "../utils/Loader";
import { Link } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import Seo from '../components/Seo/seo';

function HomePage() {
  const {
    getAllCategories,
    loading: categoryLoading,
    error,
    initialized,
  } = useCategory();
  const { getProducts, loading: productLoading, error: productError } = useProduct();

  // State to store the categories data
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState({ items: [] });
  // Local loading state for initial render
  const [localLoading, setLocalLoading] = useState(!initialized);

  useEffect(() => {
    // If data is not initialized yet, load it
    if (!initialized) {
      const fetchData = async () => {
        try {
          setLocalLoading(true);
          // Call the getAllCategories function to get the actual data
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

      fetchData();
    } else if (typeof getAllCategories === "function") {
      // If already initialized but we still need to get categories
      const fetchCategories = async () => {
        try {
          const categoriesData = await getAllCategories();
          setCategories(categoriesData || []);
        } catch (err) {
          console.error("Error fetching categories:", err);
        }
      };

      fetchCategories();
    }
  }, [initialized, getAllCategories, getProducts]);

  // Use either the global loading state or local loading state
  const isLoading = categoryLoading || localLoading;
  const banners = [
    {
      title: "New Arrivals",
      subtitle:
        "Shop the latest trends in fashion, electronics, and more — just landed!",
      buttonText: "Shop Now",
      buttonLink: "/new-arrivals",
      image: "https://source.unsplash.com/1600x600/?shopping,clothes",
      bg: "bg-gradient-to-r from-pink-400 to-red-500",
    },
    {
      title: "Mega Sale",
      subtitle: "Get up to 70% off on select products for a limited time only!",
      buttonText: "Grab Deals",
      buttonLink: "/sale",
      image: "https://source.unsplash.com/1600x600/?sale,discount",
      bg: "bg-gradient-to-r from-indigo-500 to-purple-600",
    },
    {
      title: "Shop by Category",
      subtitle: "Explore electronics, fashion, home essentials, and much more.",
      buttonText: "Browse Categories",
      buttonLink: "/categories",
      image: "https://source.unsplash.com/1600x600/?online,shopping",
      bg: "bg-gradient-to-r from-blue-400 to-green-500",
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
      description: "30-day return policy",
    },
    {
      icon: "fas fa-shield-alt",
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
      title: "Secure Payment",
      description: "100% secure checkout",
    },
    {
      icon: "fas fa-headset",
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
      title: "24/7 Support",
      description: "Dedicated support",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
        <Seo
        title={`LetsCMS React Ecommerce `}
        description={`Details and specifications for React.`}
        keywords={`product details, letscms ecommerce`}
      />
      <Herobanner banners={banners} />

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

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center text-gray-800 relative hidden md:block">
            <span className="inline-block relative">
              Why Shop With Us
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-indigo-500 rounded-full"></span>
            </span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <Featurebox features={features} />
          </div>
        </div>
      </section>
      
      {/* Newsletter Section - New Addition */}
      <section className="py-12 md:py-16 bg-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-gray-600 mb-8">
              Stay updated with our latest products and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-grow max-w-md"
              />
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition-colors duration-300 shadow-md">
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
