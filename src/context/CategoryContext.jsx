import React, { createContext, useContext, useState, useCallback } from 'react';
import { getCategoryTree, getCategoryByUrlKey } from '../api/category';

// Create context
const CategoryContext = createContext(null);

// Provider component
export const CategoryProvider = ({ children }) => {
  const [categoryTree, setCategoryTree] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  // Load category tree
  const loadCategoryTree = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategoryTree();
      
      // With GraphQL, getCategoryTree now returns a single object with the tree structure
      // instead of an array of categories
      if (!data) {
        throw new Error('Could not load category tree');
      }
      
      setCategoryTree(data);
      setInitialized(true);
      setLoading(false);
      return data;
    } catch (err) {
      console.error('Error loading category tree:', err);
      setError('Failed to load categories. Please try again later.');
      setLoading(false);
      return null;
    }
  }, []);

  // Load category by URL key
  const loadCategoryByUrlKey = useCallback(async (urlKey) => {
    try {
      setLoading(true);
      setError(null);
      const category = await getCategoryByUrlKey(urlKey);
      
      setCurrentCategory(category);
      setLoading(false);
      return category;
    } catch (err) {
      console.error('Error loading category by URL key:', err);
      setError('Failed to load category. Please try again later.');
      setLoading(false);
      return null;
    }
  }, []);

  // Get category by ID from the tree
  const getCategoryById = useCallback((id, category = categoryTree) => {
    if (!category) return null;
    
    // Check if the current category matches
    if (category.id === id || category.category_id === id) {
      return category;
    }
    
    // Check in children_data (GraphQL structure) or children (old structure)
    const children = category.children_data || category.children || [];
    
    for (const child of children) {
      const found = getCategoryById(id, child);
      if (found) return found;
    }
    
    return null;
  }, [categoryTree]);

  // Get category path (breadcrumbs)
  const getCategoryPath = useCallback((urlKey, category = categoryTree, path = []) => {
    if (!category) return [];
    
    const newPath = [...path, category];
    
    if (category.url_key === urlKey) {
      return newPath;
    }
    
    // Check in children_data (GraphQL structure) or children (old structure)
    const children = category.children_data || category.children || [];
    
    for (const child of children) {
      const found = getCategoryPath(urlKey, child, newPath);
      if (found.length > 0) return found;
    }
    
    return [];
  }, [categoryTree]);

  // Get subcategories for a given category
  const getSubcategories = useCallback((categoryId) => {
    const category = getCategoryById(categoryId);
    if (!category) return [];
    
    // Return children_data (GraphQL structure) or children (old structure)
    return category.children_data || category.children || [];
  }, [getCategoryById]);

  // Check if category has children
  const hasChildren = useCallback((categoryId) => {
    const category = getCategoryById(categoryId);
    if (!category) return false;
    
    // Check children_count or length of children_data/children
    if (category.children_count !== undefined) {
      return category.children_count > 0;
    }
    
    const children = category.children_data || category.children || [];
    return children.length > 0;
  }, [getCategoryById]);

  // Get all categories as a flat list
  const getAllCategories = useCallback(() => {
    if (!categoryTree) return [];
    
    const flattenCategories = (category, result = []) => {
      if (!category) return result;
      
      // Add current category to result
      result.push(category);
      
      // Process children
      const children = category.children_data || category.children || [];
      children.forEach(child => flattenCategories(child, result));
      
      return result;
    };
    
    return flattenCategories(categoryTree);
  }, [categoryTree]);

  // Clear error utility function
  const clearError = useCallback(() => setError(null), []);

  // Context value
  const value = {
    categoryTree,
    loading,
    error,
    initialized,
    currentCategory,
    loadCategoryTree,
    loadCategoryByUrlKey,
    getCategoryById,
    getCategoryPath,
    getSubcategories,
    hasChildren,
    getAllCategories,
    clearError
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

// Custom hook to use the category context
export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
};

// Add this export to fix the import error
export const useCategoryContext = useCategory;

export default CategoryContext;
