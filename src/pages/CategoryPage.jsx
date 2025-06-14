import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Combined loading and error states
  const isLoading = contextLoading || categoryDetailsLoading || loading;
  const error = contextError || categoryDetailsError;

  // Fetch initial category data
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        if (!slug) return;

        const category = await loadCategoryByUrlKey(slug);
        if (!category?.id) return;

        const [filters, breadcrumbData, products] = await Promise.all([
          getProductFilters(category.id),
          getCategoryBreadcrumbs(category.id),
          getProductsByCategory(category.id, {
            currentPage: 1,
            pageSize,
            sortField: sortOption,
            sortDirection,
          }),
        ]);

        setCategoryAggregations(filters || []);
        setBreadcrumbs(breadcrumbData || []);
        setChildCategories(category.children_data || []);
        setDisplayedProducts(products.items || []);
        setTotalProducts(products.total_count || 0);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [
    slug,
    loadCategoryByUrlKey,
    getProductFilters,
    getCategoryBreadcrumbs,
    getProductsByCategory,
  ]);

  // Fetch products when filters, sort, or page changes
  const fetchProducts = useCallback(async () => {
    if (!currentCategory?.id) return;

    setLoading(true);
    try {
      const attributeFilterGroups = Object.entries(appliedFilters)
        .filter(([, values]) => values.length > 0)
        .map(([attributeCode, values]) => {
          if (attributeCode === "price") {
            const [from, to] = values[0].split("_");
            const priceFilter = { field: "price" };
            if (from && from !== "*") priceFilter.from = from;
            if (to && to !== "*") priceFilter.to = to;
            return { filters: [priceFilter] };
          }
          return {
            filters: values.map((value) => ({
              field: attributeCode,
              value,
              condition_type: "in",
            })),
          };
        });

      const searchCriteria = {
        currentPage,
        pageSize,
        sortField: sortOption,
        sortDirection,
        filterGroups: attributeFilterGroups,
      };

      const data = await getProductsByCategory(
        currentCategory.id,
        searchCriteria
      );
      setDisplayedProducts(data.items || []);
      setTotalProducts(data.total_count || 0);
      setHasMore(currentPage < Math.ceil((data.total_count || 0) / pageSize));
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [
    currentCategory,
    currentPage,
    pageSize,
    sortOption,
    sortDirection,
    appliedFilters,
    getProductsByCategory,
  ]);

  // Debounced product fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  // LCP optimization
  useEffect(() => {
    if (displayedProducts.length > 0) {
      const firstProduct = displayedProducts[0];
      const lcpImageUrl =
        firstProduct?.image?.url ||
        firstProduct?.small_image?.url ||
        firstProduct?.thumbnail?.url;
      if (lcpImageUrl) {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = lcpImageUrl;
        document.head.appendChild(link);
      }
    }
  }, [displayedProducts]);

  // Handlers
  const handleFilterChange = useCallback((attributeCode, newValues) => {
    setAppliedFilters((prev) => ({
      ...prev,
      [attributeCode]: newValues.length ? newValues : undefined,
    }));
    setCurrentPage(1);
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
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const toggleFilter = () => setIsFilterOpen((prev) => !prev);

  // Render loading skeleton
  if (isLoading && displayedProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Breadcrumbs skeleton */}
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>

        {/* Title skeleton */}
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>

        {/* Filter and sort skeleton */}
        <div className="flex justify-between mb-6">
          <div className="h-10 bg-gray-200 rounded w-32"></div>
          <div className="h-10 bg-gray-200 rounded w-48"></div>
        </div>

        {/* Product grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-96 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  // Render error state
  if (error && displayedProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p>{error.message || "Could not load category data."}</p>
          <Link
            to="/"
            className="text-indigo-600 hover:underline mt-2 inline-block"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(totalProducts / pageSize);

  return (
    <>
      <Seo
        title={currentCategory?.name || "Category Products"}
        description={
          currentCategory?.description || "Browse products in this category."
        }
        keywords={currentCategory?.meta_keywords || ""}
        ogTitle={currentCategory?.name || "Category Products"}
        ogDescription={
          currentCategory?.description || "Browse products in this category."
        }
        ogImage={currentCategory?.image || ""}
        ogUrl={`${window.location.origin}${location.pathname}`}
      />

      <div className="container mx-auto px-4 py-6 sm:py-8 animate-fade-in">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex flex-wrap text-sm sm:text-base">
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

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {currentCategory?.name}
          </h1>
          {currentCategory?.description && (
            <div
              className="text-gray-600 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: currentCategory.description }}
            />
          )}
        </div>

        {/* Subcategories */}
        {childCategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Subcategories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {childCategories.map((child) => (
                <Link
                  key={child.id}
                  to={`/category/${child.url_key || child.id}`}
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-center transition border border-gray-200"
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

        {/* Main Content */}
        <div className="flex flex-col gap-6">
          {/* Filters and Sort */}
          <div className="flex justify-between items-center">
            <button
              onClick={toggleFilter}
              className="md:hidden bg-indigo-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              {isFilterOpen ? "Hide Filters" : "Show Filters"}
            </button>
            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2 text-gray-600">
                Sort by:
              </label>
              <select
                id="sort"
                className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={`${sortOption}_${sortDirection}`}
                onChange={handleSortChange}
                disabled={loading}
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

          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Sidebar */}
            <aside
              className={`w-full md:w-1/4 ${
                isFilterOpen ? "block" : "hidden md:block"
              }`}
            >
              {categoryAggregations.length > 0 && (
                <ProductFilter
                  filters={categoryAggregations}
                  appliedFilters={appliedFilters}
                  onFilterChange={handleFilterChange}
                />
              )}
            </aside>

            {/* Product Grid */}
            <main className="w-full md:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  Showing {displayedProducts.length} of {totalProducts} products
                </p>
              </div>

              {loading && displayedProducts.length > 0 ? (
                <div className="flex justify-center my-8">
                  <div className="container mx-auto px-4 py-6 sm:py-8">                  

                    {/* Product grid skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-gray-200 h-96 rounded-lg"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : displayedProducts.length === 0 ? (
                <div className="bg-gray-100 p-8 text-center rounded-lg">
                  <p className="text-gray-600">
                    No products found matching your criteria.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedProducts.map((product, index) => (
                    <ProductCard
                      key={product.id || `product-${index}`}
                      product={product}
                      isLCPCandidate={index === 0 && currentPage === 1}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                      className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                    >
                      Previous
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === pageNum
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <span className="px-2">...</span>
                    )}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                      >
                        {totalPages}
                      </button>
                    )}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || loading}
                      className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

export default CategoryPage;
