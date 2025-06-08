import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCategoryByUrlKey, getCategoryProducts } from '../../api/category';
import ProductCard from '../product/ProductCard';
import Loader from '../../utils/Loader';
import Pagination from '../common/Pagination';
import SortOptions from './SortOptions';
import FilterPanel from './FilterPanel';

const CategoryProductListing = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(12);
  const [sortField, setSortField] = useState('position');
  const [sortDirection, setSortDirection] = useState('ASC');
  const [filters, setFilters] = useState({});
  const [availableFilters, setAvailableFilters] = useState([]);

  // Fetch category data
  const fetchCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      const categoryData = await getCategoryByUrlKey(slug);
      
      if (!categoryData) {
        throw new Error('Category not found');
      }
      
      setCategory(categoryData);
      
      // If category has products, fetch them
      if (categoryData.id) {
        await fetchProducts(categoryData.id);
      } else {
        throw new Error('Category not found or has no ID');
      }
    } catch (err) {
      console.error('Error fetching category:', err);
      setError(err.message || 'Failed to load category');
      setLoading(false);
    }
  };

  // Fetch products for the category
  const fetchProducts = async (categoryId) => {
   
    try {
      const options = {
        pageSize,
        currentPage,
        sortField,
        sortDirection
      };
      
      const productsData = await getCategoryProducts(categoryId, options);
      
      setProducts(productsData.items || []);
      setTotalPages(productsData.page_info?.total_pages || 0);
      setTotalCount(productsData.total_count || 0);
      
      // Set available filters
      if (productsData.aggregations) {
        setAvailableFilters(productsData.aggregations);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle sort change
  const handleSortChange = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);
  };

  // Handle filter change
  const handleFilterChange = (filterCode, value) => {
    setFilters(prev => ({
      ...prev,
      [filterCode]: value
    }));
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  // Fetch category when slug changes
  useEffect(() => {
    if (slug) {
      fetchCategory();
    }
  }, [slug]);

  // Fetch products when pagination or sorting changes
  useEffect(() => {
    if (category?.id) {
      fetchProducts(category.id);
    }
  }, [currentPage, sortField, sortDirection, filters]);
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Category not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <div 
            className="text-gray-600"
            dangerouslySetInnerHTML={{ __html: category.description }}
          />
        )}
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <FilterPanel 
            filters={availableFilters} 
            selectedFilters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
        <div>
          <SortOptions 
            sortField={sortField} 
            sortDirection={sortDirection} 
            onSortChange={handleSortChange} 
          />
        </div>
      </div>

      {/* Product Count */}
      <div className="mb-4 text-gray-600">
        Showing {products.length} of {totalCount} products
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No products found in this category.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(CategoryProductListing);