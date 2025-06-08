import React, { useEffect, useState, useCallback, useMemo } from "react"; // Added useMemo
import { useParams, Link } from "react-router-dom";
import { useProduct } from "../hooks/useProduct.jsx";
import useCategory from "../hooks/useCategory";
import ProductFilter from "../components/product/ProductFilter.jsx";
import ProductCard from "../components/product/ProductCard.jsx";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";
import Seo from "../components/Seo/seo";

function CategoryPage() {
  const { slug } = useParams();
  const {
    getProductsByCategory,
    getProductFilters,
    // productFilters, // This state seems to be for all filters, categoryAggregations is used for category-specific
    contextLoading,
    contextError,
  } = useProduct();

  const {
    currentCategory,
    loadCategoryByUrlKey,
    getCategoryBreadcrumbs,
    loading: categoryDetailsLoading,
    error: categoryDetailsError,
  } = useCategory();

  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [categoryAggregations, setCategoryAggregations] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [sortOption, setSortOption] = useState("position");
  const [sortDirection, setSortDirection] = useState("ASC");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingpop, setLoadingpop] = useState(false);

  useEffect(() => {
    const fetchInitialCategoryData = async () => {
      if (!slug) return;
      setLoadingpop(true);
      const category = await loadCategoryByUrlKey(slug);
      if (category && category.id) {
        const filters = await getProductFilters(category.id);
        setCategoryAggregations(filters || []);
        const breadcrumbData = await getCategoryBreadcrumbs(category.id);
        setBreadcrumbs(breadcrumbData || []);
        if (category.children_data) {
          setChildCategories(category.children_data);
        }
      }
      // setLoadingpop(false); // Moved to fetchCategoryProducts finally block
    };
    fetchInitialCategoryData();
  }, [slug, loadCategoryByUrlKey, getProductFilters, getCategoryBreadcrumbs]);

  useEffect(() => {
    setDisplayedProducts([]);
    setCurrentPage(1);
    setHasMore(true);
  }, [slug, appliedFilters, sortOption, sortDirection]);

  const attributeFilterGroups = useMemo(() => {
    return Object.entries(appliedFilters)
      .filter(([, values]) => values.length > 0)
      .map(([attributeCode, values]) => {
        if (attributeCode === "price") {
          if (values.length > 0) {
            const priceValue = values[0];
            const [from, to] = priceValue.split("_");
            const priceFilter = { field: "price" };
            if (from && from !== "*") priceFilter.from = from;
            if (to && to !== "*") priceFilter.to = to;
            return { filters: [priceFilter] };
          }
          return null;
        } else {
          return {
            filters: values.map((value) => ({
              field: attributeCode,
              value: value,
              condition_type: "in",
            })),
          };
        }
      })
      .filter((group) => group !== null);
  }, [appliedFilters]);

  const fetchCategoryProducts = useCallback(async () => {
    setLoadingpop(true);
    if (!currentCategory || !currentCategory.id) {
      setLoadingpop(false);
      return;
    }

    const searchCriteriaForCategory = {
      currentPage,
      pageSize,
      sortField: sortOption,
      sortDirection,
      filterGroups: attributeFilterGroups,
    };

    try {
      const data = await getProductsByCategory(
        currentCategory.id,
        searchCriteriaForCategory
      );
      setDisplayedProducts(data.items || []);
      setTotalProducts(data.total_count || 0);
      const calculatedTotalPages = Math.ceil(
        (data.total_count || 0) / pageSize
      );
      setHasMore(currentPage < calculatedTotalPages);
    } catch (err) {
      console.error("Error fetching category products:", err);
    } finally {
      setLoadingpop(false);
    }
  }, [
    currentCategory,
    currentPage,
    pageSize,
    sortOption,
    sortDirection,
    attributeFilterGroups,
    getProductsByCategory,
  ]);

  useEffect(() => {
    if (currentCategory) {
      fetchCategoryProducts();
    }
  }, [fetchCategoryProducts, currentCategory]);

  useEffect(() => {
    if (displayedProducts.length > 0) {
      const firstProduct = displayedProducts[0];
      const lcpImageUrl =
        firstProduct?.image?.url ||
        firstProduct?.small_image?.url ||
        firstProduct?.thumbnail?.url;
      if (lcpImageUrl) {
        const preloadLink = document.getElementById("lcp-image-preload");
        if (preloadLink) {
          preloadLink.href = lcpImageUrl;
        }
      }
    }
  }, [displayedProducts]);

  const handleFilterChange = useCallback((attributeCode, newValues) => {
    setAppliedFilters((prev) => {
      const updatedFilters = { ...prev };
      if (newValues.length === 0) {
        delete updatedFilters[attributeCode];
      } else {
        updatedFilters[attributeCode] = newValues;
      }
      return updatedFilters;
    });
    // setCurrentPage(1); // This is handled by the useEffect watching appliedFilters
  }, []);

  const handleSortChange = useCallback((e) => {
    const value = e.target.value;
    if (value.includes("_")) {
      const [field, direction] = value.split("_");
      setSortOption(field);
      setSortDirection(direction.toUpperCase());
    } else {
      setSortOption(value);
      setSortDirection("ASC");
    }
    // setCurrentPage(1); // This is handled by the useEffect watching sortOption/sortDirection
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  }, []);

  const isLoadingInitial = contextLoading || (categoryDetailsLoading && !currentCategory);
  const displayError = contextError || categoryDetailsError;

  if (isLoadingInitial && !currentCategory) { // Initial load for category details
    return <LoadingSpinner />;
  }

  if (displayError && !currentCategory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{displayError.message || "An error occurred loading category details."}</p>
          <p className="mt-2">
            <Link to="/" className="text-indigo-600 hover:underline">
              Return to homepage
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (!currentCategory && !isLoadingInitial) { // Category not found after attempting to load
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Category not found.</p>
          <p className="mt-2">
            <Link to="/" className="text-indigo-600 hover:underline">
              Return to homepage
            </Link>
          </p>
        </div>
      </div>
    );
  }
  
  // Loading state for products specifically, after category details are loaded
  if (loadingpop && displayedProducts.length === 0 && currentCategory) {
      return <LoadingSpinner />;
  }


  const totalPages = Math.ceil(totalProducts / pageSize);

  return (
    <>
      <Seo
        title={currentCategory?.name || "Category Products"}
        description={currentCategory?.description || "Browse products in this category."}
        keywords={currentCategory?.meta_keywords || ""}
        ogTitle={currentCategory?.name || "Category Products"}
        ogDescription={currentCategory?.description || "Browse products in this category."}
        ogImage={currentCategory?.image || ""}
        ogUrl={`${window.location.origin}${location.pathname}`}
      />

      <div className="container mx-auto px-4 py-8">
        <nav className="mb-6">
          <ol className="flex flex-wrap text-sm">
            <li className="flex items-center">
              <Link to="/" className="text-gray-600 hover:text-indigo-600">
                Home
              </Link>
              <span className="mx-2 text-gray-400">/</span>
            </li>
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.id} className="flex items-center">
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-indigo-600">{crumb.name}</span>
                ) : (
                  <>
                    <Link
                      to={crumb.url}
                      className="text-gray-600 hover:text-indigo-600"
                    >
                      {crumb.name}
                    </Link>
                    <span className="mx-2 text-gray-400">/</span>
                  </>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{currentCategory?.name}</h1>
          {currentCategory?.description && (
            <div
              className="text-gray-600 mb-4"
              dangerouslySetInnerHTML={{ __html: currentCategory.description }}
            />
          )}
        </div>

        {childCategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Subcategories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {childCategories.map((child) => (
                <Link
                  key={child.id}
                  to={`/category/${child.url_key || child.id}`}
                  className="bg-gray-100 hover:bg-gray-200 rounded-lg p-4 text-center transition"
                >
                  <div className="font-medium">{child.name}</div>
                  {child.product_count && (
                    <div className="text-sm text-gray-600 mt-1">
                      {child.product_count} products
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-1/4">
            {categoryAggregations.length > 0 && (
              <ProductFilter
                filters={categoryAggregations}
                appliedFilters={appliedFilters}
                onFilterChange={handleFilterChange}
              />
            )}
          </aside>
          <main className="w-full md:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div className="mb-4 sm:mb-0">
                <p className="text-gray-600">
                  Showing {displayedProducts.length} of {totalProducts} products
                </p>
              </div>
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-gray-600">
                  Sort by:
                </label>
                <select
                  id="sort"
                  className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  value={`${sortOption}_${sortDirection}`}
                  onChange={handleSortChange}
                >
                  <option value="position_ASC">Position</option>
                  <option value="name_ASC">Name (A-Z)</option>
                  <option value="name_DESC">Name (Z-A)</option>
                  <option value="price_ASC">Price (Low to High)</option>
                  <option value="price_DESC">Price (High to Low)</option>
                  <option value="created_at_DESC">Newest</option>
                </select>
              </div>
            </div>

            {/* Product Grid Logic */}
            {loadingpop && displayedProducts.length === 0 ? ( // Show spinner if loading and no products yet
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
              </div>
            ) : !loadingpop && displayError && displayedProducts.length === 0 ? ( // Show error if loading failed and no products
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p>{displayError.message || "Could not load products."}</p>
              </div>
            ) : !loadingpop && displayedProducts.length > 0 ? ( // Show products if loaded
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProducts.map((product, index) => (
                  <ProductCard
                    key={product.id || `product-item-${index}`}
                    product={product}
                    isLCPCandidate={index === 0 && currentPage === 1}
                  />
                ))}
              </div>
            ) : !loadingpop && !displayError && displayedProducts.length === 0 && totalProducts === 0 ? ( // No products found
              <div className="bg-gray-100 p-8 text-center rounded-lg">
                <p className="text-gray-600">
                  No products found matching your criteria.
                </p>
              </div>
            ) : null}


            {loadingpop && displayedProducts.length > 0 && (
              <div className="flex justify-center my-8">
                <LoadingSpinner />
              </div>
            )}
            {!loadingpop && displayedProducts.length > 0 && !hasMore && totalProducts > 0 && (
              <p className="text-center text-gray-500 my-8">
                You've reached the end of the results.
              </p>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loadingpop}
                    className={`mx-1 px-3 py-1 rounded ${
                      currentPage === 1 || loadingpop
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loadingpop}
                          className={`mx-1 px-3 py-1 rounded ${
                            currentPage === pageNum
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          } ${loadingpop ? "cursor-not-allowed opacity-50" : ""}`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      (pageNum === currentPage - 2 && currentPage > 3) ||
                      (pageNum === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span key={pageNum} className="mx-1">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loadingpop}
                    className={`mx-1 px-3 py-1 rounded ${
                      currentPage === totalPages || loadingpop
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default CategoryPage;
