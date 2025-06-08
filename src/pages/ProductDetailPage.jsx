import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCategory } from "../context/CategoryContext";
import useProduct from "../hooks/useProduct";
import { useWishlist } from "../context/WishlistContext";
import { isAuthenticated } from "../api/auth";
import LoadingSpinner from "../utils/Loader";
import ErrorMessage from "../components/ui/ErrorMessage";
import { formatPrice } from "../utils/formatters";
import AddToCartButton from "../components/cart/AddToCartButton";
import Seo from "../components/Seo/seo";
import ProductReviewForm from "../components/product/ProductReviewForm";
import ProductReviewItem from "../components/product/ProductReviewItem";
import { getProductReviews } from "../api/review";
const  ConfigurableProductOptions  = React.lazy(() => import ( "../components/product/ConfigurableProductOptions"));
const  BundleProductOptions = React.lazy(() => import ( "../components/product/BundleProductOptions"));
import DownloadableProductLinks from "../components/product/DownloadableProductLinks";
import GroupedProductItems from "../components/product/GroupedProductItems";
import {
  HeartIcon,
  ShoppingCartIcon,
  StarIcon,
  StarSolidIcon,

} from "../components/ui/Icons";

const ProductDetailPage = () => {
  const { urlKey } = useParams();
  const navigate = useNavigate();
  const user = isAuthenticated();

  // Product data and state
  const { product, loading, error, getProductByUrlKey } = useProduct();
  const { isInWishlist, addItemToWishlist, removeItemFromWishlist } = useWishlist();
  
  // Component state
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  
  // Product variant state
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedConfigurableOptions, setSelectedConfigurableOptions] = useState({});
  const [selectedBundleItems, setSelectedBundleItems] = useState({});
  const [currentBundlePrice, setCurrentBundlePrice] = useState(null);
  const [groupedItemQuantities, setGroupedItemQuantities] = useState({});

  // Memoized values
  const isProductInWishlist = useMemo(() => {
    return product && isInWishlist(selectedVariant?.product?.id || product.id);
  }, [product, selectedVariant, isInWishlist]);

  const displayProduct = selectedVariant?.product || product;
  const currentPriceInfo = useMemo(() => {
    if (product?.type_id === "bundle" && currentBundlePrice !== null) {
      return {
        final_price: {
          value: currentBundlePrice,
          currency: product.price_range.minimum_price.final_price.currency,
        },
        regular_price: product.price_range.minimum_price.regular_price,
        discount: product.price_range.minimum_price.discount,
      };
    }
    return displayProduct?.price_range?.minimum_price || {};
  }, [product, displayProduct, currentBundlePrice]);

  const { regular_price, final_price, discount } = currentPriceInfo;
  const isOnSale = useMemo(() => 
    discount && (discount.amount_off > 0 || discount.percent_off > 0),
    [discount]
  );

  // Handlers
  const handleWishlistClick = useCallback(async () => {
    if (!user) {
      navigate("/login", { state: { from: `/product/${urlKey}` } });
      return;
    }

    try {
      if (isProductInWishlist) {
        await removeItemFromWishlist(product.id);
      } else {
        await addItemToWishlist(product.sku);
      }
    } catch (err) {
      console.error("Wishlist operation failed:", err);
    }
  }, [user, isProductInWishlist, product, selectedVariant, urlKey]);

  const handleVariantChange = useCallback((variant, options) => {
    setSelectedVariant(variant);
    setSelectedConfigurableOptions(options);
    if (variant?.product?.small_image?.url) {
      setSelectedImage(variant.product.small_image.url);
    } else if (product?.image?.url) {
      setSelectedImage(product.image.url);
    }
  }, [product]);

  const handleBundleSelectionChange = useCallback((selections, totalPrice) => {
    setSelectedBundleItems(selections);
    setCurrentBundlePrice(totalPrice);
  }, []);

  const handleGroupedItemsChange = useCallback((quantities) => {
    setGroupedItemQuantities(quantities);
  }, []);

  const handleReviewSubmitted = useCallback(() => {
    if (product?.sku) {
      fetchReviews(product.sku);
    }
  }, [product?.sku]);

  const handleQuantityChange = useCallback((e) => {
    const value = parseInt(e.target.value);
    if (value > 0) setQuantity(value);
   
  }, []);
  const incrementQuantity = useCallback(() => 
    setQuantity(prev => Math.min(prev + 1, 999)), []);
    
  const decrementQuantity = useCallback(() => 
    setQuantity(prev => Math.max(prev - 1, 1)), []);

  // Data fetching
  const fetchReviews = useCallback(async (sku) => {
    if (!sku) return;
    setReviewsLoading(true);
    setReviewsError(null);
    try {
      const result = await getProductReviews(sku);
      if (result.success) {
        setReviews(result.reviews || []);
      } else {
        setReviewsError(result.message || "Failed to load reviews.");
        setReviews([]);
      }
    } catch (error) {
      setReviewsError("An error occurred while fetching reviews.");
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!urlKey) return;
      try {
        const productData = await getProductByUrlKey(urlKey);
        setSelectedImage(
          productData?.media_gallery?.[0]?.url || 
          productData?.small_image?.url || 
          null
        );
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };
    fetchProductData();
  }, [urlKey, getProductByUrlKey]);

  useEffect(() => {
    if (product?.sku) {
      fetchReviews(product.sku);
    }
  }, [product?.sku, fetchReviews]);

  // Early returns for loading/error states
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error || `Product "${urlKey}" not found`} />
      </div>
    );
  }

  // Main render
  return (
    <>
      <Seo
        title={displayProduct.meta_title || displayProduct.name}
        description={displayProduct.meta_description || displayProduct.description?.html}
        ogImage={selectedImage || displayProduct.image?.url}
        canonicalUrl={`https://example.com/products/${product.url_key}`}
      />

      <div className="bg-gray-50">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm">
            <ol className="flex items-center space-x-2">
              <li className="flex items-center">
                <a href="/" className="text-gray-500 hover:text-indigo-600">Home</a>              
              <span className="mx-2 text-gray-400">/</span>
              </li> 
              <li className="text-indigo-600 font-medium">{product.name}</li>
            </ol>
          </nav>
        </div>

        {/* Product Main Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row -mx-4">
            {/* Product Gallery */}
            <div className="md:flex-1 px-4 mb-6 md:mb-0">
              <div className="h-64 md:h-80 rounded-lg bg-gray-100 mb-4 flex items-center justify-center">
                <img
                  src={selectedImage || displayProduct.small_image?.url}
                  alt={displayProduct.name}
                 loading="eager"
                  className="max-h-full max-w-full object-contain "
                  width="300px"
                  height="300px"
                />
              </div>

              {/* Image Thumbnails */}
              {product.media_gallery?.length > 0 && (
                <div className="flex flex-wrap -mx-2 mb-4">
                  {product.media_gallery.map((image, index) => (
                    <div
                      key={image.url || index}
                      className="w-1/4 px-2 mb-4"
                      onClick={() => setSelectedImage(image.url)}
                    >
                      <div className={`h-24 rounded-lg bg-gray-100 flex items-center justify-center cursor-pointer ${
                        image.url === selectedImage ? "ring-2 ring-indigo-500" : ""
                      }`}>
                        <img
                          src={image.url}
                          alt={image.label || `${product.name} thumbnail ${index + 1}`}
                          loading="lazy"
                          className="max-h-full max-w-full object-contain w-[100px] h-[00px] "
                          width="100px"
                          height="100px"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="md:flex-1 px-4">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {displayProduct.name}
              </h1>

              <div className="mb-4 space-y-2">
                <div className="flex items-center">
                  <span className="font-bold text-gray-700 mr-2">SKU:</span>
                  <span className="text-gray-600">{displayProduct.sku}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="font-bold text-gray-700 mr-2">Availability:</span>
                  <span className={
                    displayProduct.stock_status === "IN_STOCK" 
                      ? "text-green-600" 
                      : "text-red-600"
                  }>
                    {displayProduct.stock_status === "IN_STOCK" 
                      ? "In Stock" 
                      : "Out of Stock"}
                  </span>
                </div>
              </div>
{/*   Product Type Specific Components */}
              {product.type_id === "configurable" && product.configurable_options && (
                <ConfigurableProductOptions
                  product={product}
                  onVariantChange={handleVariantChange}
                  selectedOptions={selectedConfigurableOptions}
                />
              )}
              
              {product.type_id === "bundle" && product.items && (
                <BundleProductOptions
                  product={product} 
                  onBundleSelectionChange={handleBundleSelectionChange}
                />
              )}
              
              {product.type_id === "downloadable" && (
                <DownloadableProductLinks product={product} />
              )}
              
              {product.type_id === "grouped" && product.items && (
                <GroupedProductItems
                  product={product}
                  onGroupedItemsChange={handleGroupedItemsChange}
                />
              )}

              {/* Price Display */}
              <div className="mb-4">
                {isOnSale ? (
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-indigo-600 mr-2">
                      {formatPrice(final_price.value, final_price.currency)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(regular_price.value, regular_price.currency)}
                    </span>
                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                      SALE
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-indigo-600">
                    {formatPrice(final_price.value, final_price.currency)}
                  </span>
                )}
              </div>

              {/* Add to Cart Section */}
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-l"
                      onClick={decrementQuantity}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="999"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="py-2 px-4 text-center w-16 border-none focus:outline-none focus:ring-0"
                      aria-label="Quantity"
                    />
                    <button
                      className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-r"
                      onClick={incrementQuantity}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <AddToCartButton
                    product={displayProduct}
                    quantity={quantity}
                    selectedOptions={
                      product.type_id === "configurable" 
                        ? selectedConfigurableOptions 
                        : undefined
                    }
                    bundleSelections={
                      product.type_id === "bundle" 
                        ? selectedBundleItems 
                        : undefined
                    }
                    groupedItemsQuantities={
                      product.type_id === "grouped" 
                        ? groupedItemQuantities 
                        : undefined
                    }
                    disabled={
                      (product.type_id !== "grouped" && displayProduct.stock_status !== "IN_STOCK") ||
                      (product.type_id === "configurable" && !selectedVariant) ||
                      (product.type_id === "bundle" && 
                        (!selectedBundleItems || 
                         Object.keys(selectedBundleItems).length === 0 ||
                         (product.items && 
                          !product.items.every(item => 
                            item.required ? selectedBundleItems[item.option_id] : true
                          )))) ||
                      (product.type_id === "grouped" && 
                        (!groupedItemQuantities || 
                         Object.values(groupedItemQuantities).every(qty => qty === 0) ||
                         (product.items && 
                          Object.entries(groupedItemQuantities).some(([sku, qty]) => {
                            if (qty > 0) {
                              const itemInGroup = product.items.find(it => it.product.sku === sku);
                              return !itemInGroup || itemInGroup.product.stock_status !== "IN_STOCK";
                            }
                            return false;
                          }))))
                    }
                  >
                    <ShoppingCartIcon />                  
                  </AddToCartButton>
                  
                  <button
                    onClick={handleWishlistClick}
                    className={`border ${
                      isProductInWishlist 
                        ? "border-red-300 bg-red-50" 
                        : "border-gray-300"
                    } text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors flex items-center`}
                    aria-label={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <HeartIcon filled={isProductInWishlist} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              {["description", "details", "reviews"].map((tab) => (
                <button
                  key={tab}
                  className={`py-2 px-4 font-medium capitalize ${
                    activeTab === tab
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-indigo-600"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="py-4">
              {activeTab === "description" && (
                <div
                  className="prose max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: product.description?.html || "No description available",
                  }}
                />
              )}

              {activeTab === "details" && (
                <div className="text-gray-600">
                  <h3 className="text-lg font-bold mb-4">Product Specifications</h3>
                  <div className="prose max-w-none">
                    <p>
                      <strong>Type:</strong>{" "}
                      <span className="capitalize">
                        {product.type_id?.replace(/_/g, " ") || "N/A"}
                      </span>
                    </p>
                    <p>
                      <strong>SKU:</strong> {displayProduct.sku}
                    </p>
                    {product.weight && (
                      <p>
                        <strong>Weight:</strong> {product.weight}
                      </p>
                    )}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: product.short_description?.html || "",
                      }}
                    />
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="text-gray-600">
                  <h3 className="text-lg font-bold mb-4">Customer Reviews</h3>
                  {reviewsLoading && <LoadingSpinner />}
                  {reviewsError && <ErrorMessage message={reviewsError} />}
                  
                  {!reviewsLoading && !reviewsError && (
                    <>
                      {reviews.length === 0 ? (
                        <p className="text-gray-500 italic mb-4">
                          No reviews yet. Be the first to review this product!
                        </p>
                      ) : (
                        <div className="space-y-6 mb-6">
                          {reviews.map((review, index) => (
                            <ProductReviewItem 
                              key={`${review.created_at}-${index}`} 
                              review={review} 
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  
                  {user ? (
                    <ProductReviewForm
                      productSku={product.sku}
                      onSubmitReviewSuccess={handleReviewSubmitted}
                    />
                  ) : (
                    <p className="text-gray-600">
                      Please{" "}
                      <button
                        onClick={() =>
                          navigate("/login", {
                            state: { from: `/product/${urlKey}` },
                          })
                        }
                        className="text-indigo-600 hover:underline"
                      >
                        log in
                      </button>{" "}
                      to write a review.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(ProductDetailPage);