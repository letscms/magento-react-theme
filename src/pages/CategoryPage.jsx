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
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial category data
  useEffect(() => {
    const fetchInitialCategoryData = async () => {
      if (!slug) return;
      
      try {
        setIsLoading(true);
        const category = await loadCategoryByUrlKey(slug);
        if (!category?.id) {
          return;
        }

        const [filters, breadcrumbData] = await Promise.all([
          getProductFilters(category.id),
          getCategoryBreadcrumbs(category.id)
        ]);

        setCategoryAggregations(filters || []);
        setBreadcrumbs(breadcrumbData || []);
        setChildCategories(category.children_data || []);
      } catch (err) {
        console.error("Error fetching category data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialCategoryData();
  }, [slug, loadCategoryByUrlKey, getProductFilters, getCategoryBreadcrumbs]);

  // Reset state when slug changes
  useEffect(() => {
    setDisplayedProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    setAppliedFilters({});
  }, [slug]);

  // Memoized filter groups
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

  // Fetch products when dependencies change
  const fetchCategoryProducts = useCallback(async () => {
    if (!currentCategory?.id) return;

    try {
      setIsLoading(true);
      const searchCriteria = {
        currentPage,
        pageSize,
        sortField: sortOption,
        sortDirection,
        filterGroups: attributeFilterGroups,
      };

      const data = await getProductsByCategory(currentCategory.id, searchCriteria);
      
      // Only update state if we got valid data
      if (data?.items) {
        setDisplayedProducts(prev => 
          currentPage === 1 ? data.items : [...prev, ...data.items]
        );
        setTotalProducts(data.total_count || 0);
        setHasMore(currentPage < Math.ceil((data.total_count || 0) / pageSize));
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
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

  // Trigger product fetch when dependencies change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategoryProducts();
    }, 100);

    return () => clearTimeout(timer);
  }, [fetchCategoryProducts]);

  // Handle filter changes
  const handleFilterChange = useCallback((attributeCode, newValues) => {
    setAppliedFilters(prev => ({
      ...prev,
      [attributeCode]: newValues.length ? newValues : undefined
    }));
    setCurrentPage(1);
  }, []);

  // Handle sort changes
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

  // Handle page changes
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  }, []);

  // Loading and error states
  const isLoadingInitial = !currentCategory && (categoryDetailsLoading || isLoading);
  const displayError = contextError || categoryDetailsError;

  if (isLoadingInitial) {
    return <LoadingSpinner />;
  }

  if (displayError && !currentCategory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{displayError.message || "An error occurred loading category details."}</p>
          <Link to="/" className="text-indigo-600 hover:underline mt-2 inline-block">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  if (!currentCategory && !isLoadingInitial) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Category not found.</p>
          <Link to="/" className="text-indigo-600 hover:underline mt-2 inline-block">
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
        description={currentCategory?.description || "Browse products in this category."}
        keywords={currentCategory?.meta_keywords || ""}
        ogTitle={currentCategory?.name || "Category Products"}
        ogDescription={currentCategory?.description || "Browse products in this category."}
        ogImage={currentCategory?.image || ""}
        ogUrl={`${window.location.origin}${location.pathname}`}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs, category header, and subcategories remain the same */}
        {/* ... */}

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
            {/* Sort and product count header */}
            {/* ... */}

            {/* Product Grid */}
            {isLoading && displayedProducts.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
              </div>
            ) : displayError && displayedProducts.length === 0 ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p>{displayError.message || "Could not load products."}</p>
              </div>
            ) : displayedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProducts.map((product, index) => (
                  <ProductCard
                    key={product.id || `product-${index}`}
                    product={product}
                    isLCPCandidate={index === 0 && currentPage === 1}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 p-8 text-center rounded-lg">
                <p className="text-gray-600">
                  No products found matching your criteria.
                </p>
              </div>
            )}

            {/* Pagination and loading indicators */}
            {isLoading && displayedProducts.length > 0 && (
              <div className="flex justify-center my-8">
                <LoadingSpinner />
              </div>
            )}

            {!isLoading && !hasMore && displayedProducts.length > 0 && (
              <p className="text-center text-gray-500 my-8">
                You've reached the end of the results.
              </p>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                {/* Pagination controls */}
                {/* ... */}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default CategoryPage;
