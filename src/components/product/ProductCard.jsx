import React, { memo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useConfig } from "../../hooks/useConfig";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import LoginWrapper from "../forms/LoginWrapper";
import Swal from "sweetalert2";
// import { isAuthenticated } from "../../api/auth"; // This was duplicated, useAuth().isAuthenticated is preferred
import { createRoot } from "react-dom/client";

// Constants for better maintainability
const PRODUCT_TYPES = {
  simple: "Simple Product",
  configurable: "Configurable",
  grouped: "Grouped Product",
  virtual: "Virtual Product",
  bundle: "Bundle Product",
  downloadable: "Downloadable",
  ConfigurableProduct: "Configurable", // Handle GraphQL typename
};

const ProductCard = ({ product, isLCPCandidate }) => {
  const { baseMediaUrl } = useConfig();
  const { addItemToCart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const [isAddingToCartState, setIsAddingToCartState] = useState(false);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const getProductTypeName = useCallback((typeId) => {
    return PRODUCT_TYPES[typeId] || typeId?.replace(/_/g, " ") || "Product";
  }, []);

  const formatPrice = useCallback((price) => {
    if (!price && price !== 0) return "Price not available";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: price?.currency || "USD",
    }).format(price?.value || 0);
  }, []);

  const getProductUrl = useCallback((prod) => {
    return prod.url_key ? `/product/${prod.url_key}` : "#";
  }, []);

  const showLoginPopup = useCallback(async () => {
    const container = document.createElement("div");
    const root = createRoot(container);

    root.render(<LoginWrapper />);

    const result = await Swal.fire({
      html: container,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        container: "login-popup-container",
        popup: "login-popup",
        closeButton: "login-popup-close",
      },
      width: "500px",
      didDestroy: () => {
        root.unmount();
      },
    });

    return result.isConfirmed;
  }, []);

  const handleAddToCart = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (isAddingToCartState || cartLoading) return;
      const userIsAuthenticated = isAuthenticated(); // Call the function
      if (!userIsAuthenticated) {
        await showLoginPopup();
        return;
      }

      const handleProductRedirect = (message) => {
        toast.error(message);
        setTimeout(() => navigate(getProductUrl(product)), 2000);
      };

      const VALIDATION_RULES = [
        {
          condition: product.stock_status !== "IN_STOCK",
          message: `${product.name} is out of stock.`,
        },
        {
          condition:
            product.__typename === "DownloadableProduct" &&
            !product.downloadable_product_links?.length,
          message: `${product.name} has no downloadable links available.`,
        },
        {
          condition:
            product.__typename === "BundleProduct" && !product.items?.length,
          message: `${product.name} has no bundle options available.`,
        },
        {
          condition:
            product.__typename === "GroupedProduct" && !product.items?.length,
          message: `${product.name} has no grouped products available.`,
        },
        {
          condition:
            product.__typename === "ConfigurableProduct" &&
            !product.configurable_options?.length,
          message: `${product.name} has no configurable options available.`,
        },
      ];

      const failedCheck = VALIDATION_RULES.find((check) => check.condition);
      if (failedCheck) {
        handleProductRedirect(failedCheck.message);
        return;
      }

      setIsAddingToCartState(true);

      try {
        const cartItem = {
          sku: product.sku || "",
          name: product.name || "Product",
          price: product.price_range?.minimum_price?.final_price?.value || 0,
          qty: 1,
          product_id: product.id,
          extension_attributes: {
            image_url: product.small_image?.url || "/placeholder.jpg",
          },
        };

        await addItemToCart(cartItem);
        toast.success(`${product.name} added to cart!`);
      } catch (error) {
        console.error("Add to cart failed:", error);
        toast.error(`Failed to add ${product.name} to cart. Try again.`);
      } finally {
        setIsAddingToCartState(false);
      }
    },
    [
      product,
      isAddingToCartState,
      cartLoading,
      addItemToCart,
      navigate,
      getProductUrl,
      isAuthenticated, // Keep isAuthenticated from useAuth in deps
      showLoginPopup,
    ]
  );

  if (!product) {
    return <div className="text-center p-4">Product data not available</div>;
  }

  const productId = product.id;
  const productUrl = getProductUrl(product);
  const imageUrl = product.small_image?.url || "/placeholder.jpg";
  const price = product.price_range?.minimum_price?.final_price;
  const regularPrice = product.price_range?.minimum_price?.regular_price;
  const discount = product.price_range?.minimum_price?.discount;
  const isOnSale = discount?.amount_off > 0 || discount?.percent_off > 0;
  const isOutOfStock = product.stock_status !== "IN_STOCK";

  return (
    <div
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={productUrl} className="block">
        <div className="h-48 overflow-hidden relative">
          <img
            src={imageUrl}
            alt={product.small_image?.label || product.name || "Product"}
            className="w-full h-full object-contain transition-transform duration-300 ease-in-out"
            width="192"
            height="192"
            loading={isLCPCandidate ? "eager" : "lazy"}
            decoding="async"
            style={{
              transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
          />
          {isOutOfStock && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Out of Stock
            </div>
          )}
          {isOnSale && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
              Sale
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={productUrl}>
          <h3 className="font-medium mb-1 hover:text-indigo-600 line-clamp-2">
            {product.name || "Unnamed Product"}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mb-1 capitalize">
          {getProductTypeName(product.__typename || product.type_id)}
        </p>

        {product.rating_summary > 0 && (
          <RatingDisplay
            rating={product.rating_summary}
            reviewCount={product.review_count}
          />
        )}

        <div className="flex justify-between items-center mt-2">
          <PriceDisplay
            price={price}
            regularPrice={regularPrice}
            isOnSale={isOnSale}
            formatPrice={formatPrice}
          />
          <AddToCartButton
            isAdding={isAddingToCartState}
            isOutOfStock={isOutOfStock}
            onClick={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
};

// Extracted components for better readability
const RatingDisplay = ({ rating, reviewCount }) => {
  const roundedRating = Math.round(rating / 20);
  return (
    <div className="flex items-center mb-2">
      <div className="flex text-yellow-400">
        {Array.from({ length: 5 }, (_, i) => (
          <StarIcon key={i} filled={i < roundedRating} />
        ))}
      </div>
      <span className="text-gray-500 text-sm ml-2">({reviewCount || 0})</span>
    </div>
  );
};

const StarIcon = ({ filled }) => (
  <svg
    className={`w-4 h-4 ${filled ? "fill-current" : "fill-gray-300"}`}
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const PriceDisplay = ({ price, regularPrice, isOnSale, formatPrice }) => (
  <div className="flex flex-col">
    <span className="text-indigo-600 font-bold">{formatPrice(price)}</span>
    {isOnSale && (
      <span className="text-gray-500 text-sm line-through">
        {formatPrice(regularPrice)}
      </span>
    )}
  </div>
);

const AddToCartButton = ({ isAdding, isOutOfStock, onClick }) => (
  <button
    className={`text-indigo-600 hover:bg-indigo-50 p-2 rounded-full ${
      isAdding || isOutOfStock ? "opacity-50 cursor-not-allowed" : ""
    }`}
    aria-label="Add to cart"
    onClick={onClick}
    disabled={isAdding || isOutOfStock}
  >
    {isAdding ? <SpinnerIcon /> : <CartIcon />}
  </button>
);

const SpinnerIcon = () => (
  <svg
    className="animate-spin h-5 w-5"
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
);

const CartIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

export default memo(ProductCard);
