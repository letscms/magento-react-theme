import React, { useEffect, useState, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { useProduct } from "../hooks/useProduct.jsx";
import ProductFilter from "../components/product/ProductFilter.jsx";
import ProductCard from "../components/product/ProductCard.jsx";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";
import Seo from "../components/Seo/seo.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Pagination from "../components/ui/Pagination.jsx"; // Assuming a Pagination component exists

function SearchResultsPage() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    searchProducts,
    globalProductAggregations, // Use global aggregations for search
    fetchGlobalProductAggregations, // Method to fetch global aggregations
    contextLoading,
    contextError,
  } = useProduct();

  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [availableFilters, setAvailableFilters] = useState([]); // This will now be populated by globalProductAggregations
  const [appliedFilters, setAppliedFilters] = useState({});
  const [sortOption, setSortOption] = useState("relevance"); // Default sort for search
  const [sortDirection, setSortDirection] = useState("DESC");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loadingPage, setLoadingPage] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("q") || "";
    setSearchQuery(query);
    // Reset states when search query changes
    setDisplayedProducts([]);
    setCurrentPage(1);
    setAppliedFilters({});
    // Fetch global aggregations for filtering options
    const loadGlobalFilters = async () => {
      if (query) {
        // Only fetch if there's a search query
        await fetchGlobalProductAggregations();
      }
    };
    loadGlobalFilters();
  }, [location.search, fetchGlobalProductAggregations]); // Add fetchGlobalProductAggregations to dependencies

  // Update availableFilters when globalProductAggregations changes from the context
  useEffect(() => {
    if (searchQuery) {
      // Only update if there's a search query
      setAvailableFilters(globalProductAggregations || []);
    } else {
      setAvailableFilters([]);
    }
  }, [globalProductAggregations, searchQuery]);
  useEffect(() => {
    setDisplayedProducts([]);
    setDisplayedProducts([]);
    setCurrentPage(1); // Reset page to 1 when filters or category changes
  }, [appliedFilters, sortOption, sortDirection]);

  const fetchSearchResults = useCallback(async () => {
    if (!searchQuery) {
      setDisplayedProducts([]);
      setTotalProducts(0);
      return;
    }

    setLoadingPage(true);

    const attributeFilterGroups = Object.entries(appliedFilters)
      .filter(([, values]) => values.length > 0)
      .map(([attributeCode, values]) => {
        // if (attributeCode === "price") {
        //   if (values.length > 0) {
        //     const priceValue = values[0];
        //     const [from, to] = priceValue.split("_");
        //     const priceFilter = { field: "price" };
        //     if (from && from !== "*") priceFilter.from = from;
        //     if (to && to !== "*") priceFilter.to = to;
        //     return { filters: [priceFilter] };
        //   }
        //   return null;
        // }
        // return {
        //   filters: values.map((value) => ({
        //     field: attributeCode,
        //     value: value,
        //     condition_type: "in",
        //   })),
        // };
      })
      .filter((group) => group !== null);

    const searchCriteria = {
      searchQuery,
      currentPage,
      pageSize,
      sortField: sortOption,
      sortDirection,
      filterGroups: attributeFilterGroups,
    };
    try {
      const data = await searchProducts(searchCriteria); // Pass the whole criteria object
      setDisplayedProducts(data?.items || []);
      setTotalProducts(data?.total_count || 0);
    } catch (err) {
      console.error("Error fetching search results:", err);
      // contextError from useProduct should ideally handle this
    } finally {
      setLoadingPage(false);
    }
  }, [
    searchQuery,
    currentPage,
    pageSize,
    sortOption,
    sortDirection,
    appliedFilters,
    searchProducts,
  ]);

  useEffect(() => {
    fetchSearchResults();
  }, [fetchSearchResults]);

  const handleFilterChange = (attributeCode, newValues) => {
    setAppliedFilters((prev) => {
      const updated = { ...prev };
      if (newValues.length === 0) {
        delete updated[attributeCode];
      } else {
        updated[attributeCode] = newValues;
      }
      return updated;
    });
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value.includes("_")) {
      const [field, direction] = value.split("_");
      setSortOption(field);
      setSortDirection(direction.toUpperCase());
    } else {
      setSortOption(value);
      setSortDirection("DESC"); // Default direction for relevance or if not specified
    }
    setCurrentPage(1); // Reset to first page on sort change
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const isLoading = contextLoading || loadingPage;
  const totalPages = Math.ceil(totalProducts / pageSize);

  if (isLoading && displayedProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (contextError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage
          message={contextError.message || "An error occurred while searching."}
        />
        <p className="mt-4 text-center">
          <Link to="/" className="text-indigo-600 hover:underline">
            Return to homepage
          </Link>
        </p>
      </div>
    );
  }

  if (!searchQuery && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Seo title="Search" description="Search for products." />
        <EmptyState message="Please enter a search term to find products." />
      </div>
    );
  }

  return (
    <>
      <Seo
        title={`Search Results for "${searchQuery}"`}
        description={`Find products matching your search for "${searchQuery}".`}
        ogTitle={`Search Results for "${searchQuery}"`}
        ogUrl={`${window.location.origin}${location.pathname}${location.search}`}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex flex-wrap text-sm">
            <li className="flex items-center">
              <Link to="/" className="text-gray-600 hover:text-indigo-600">
                Home
              </Link>
              <span className="mx-2 text-gray-400">/</span>
            </li>
            <li className="flex items-center">
              <span className="text-indigo-600">
                Search Results for "{searchQuery}"
              </span>
            </li>
          </ol>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Search Results for "{searchQuery}"
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {availableFilters.length > 0 && (
            <aside className="w-full md:w-1/4">
              <ProductFilter
                filters={availableFilters}
                appliedFilters={appliedFilters}
                onFilterChange={handleFilterChange}
              />
            </aside>
          )}
          <main
            className={`w-full ${
              availableFilters.length > 0 ? "md:w-3/4" : "md:w-full"
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div className="mb-4 sm:mb-0">
                <p className="text-gray-600">
                  {totalProducts > 0
                    ? `Showing ${displayedProducts.length} of ${totalProducts} products`
                    : "No products found."}
                </p>
              </div>
              {totalProducts > 0 && (
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
                    <option value="relevance_DESC">Relevance</option>
                    <option value="name_ASC">Name (A-Z)</option>
                    <option value="name_DESC">Name (Z-A)</option>
                    <option value="price_ASC">Price (Low to High)</option>
                    <option value="price_DESC">Price (High to Low)</option>
                    <option value="created_at_DESC">Newest</option>
                  </select>
                </div>
              )}
            </div>

            {isLoading && displayedProducts.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
              </div>
            ) : !isLoading && displayedProducts.length === 0 && searchQuery ? (
              <EmptyState
                message={`No products found for "${searchQuery}". Try a different search term or adjust your filters.`}
              />
            ) : displayedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProducts.map((products, index) => (
                  <ProductCard
                    key={products.id || `product-${index}`}
                    product={products}
                    isLCPCandidate={index === 0 && currentPage === 1}
                  />
                ))}
              </div>
            ) : null}

            {isLoading && displayedProducts.length > 0 && (
              <div className="flex justify-center my-8">
                <LoadingSpinner />
              </div>
            )}

            {totalPages > 1 && !isLoading && displayedProducts.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default SearchResultsPage;
