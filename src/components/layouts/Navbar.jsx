import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { Link, useNavigate ,NavLink } from "react-router-dom";
import { useCategory } from "../../context/CategoryContext";
import Loader from "../../utils/Loader";
import { FiChevronRight, FiMenu, FiX, FiPlus, FiMinus } from "react-icons/fi";

// Memoized category item component for desktop view
const DesktopCategoryItem = memo(({ 
  item, 
  level, 
  parentSlug, 
  activeLevels, 
  handleMouseEnter, 
  handleMouseLeave 
}) => {
  const getChildren = (item, level) => {
    if (level === 1) return item.subcategories || [];
    if (level === 2) return item.children || [];
    if (level === 3) return item.subchildren || [];
    if (level === 4) return item.subsubchildren || [];
    return [];
  };
  
  const hasChild = getChildren(item, level).length > 0;
  const slugPath = `${item.slug}`;
  const itemRef = useRef(null);
  
  // Calculate position for submenus to prevent overflow
  const [positionClass, setPositionClass] = useState("left-full ml-1");
  
  useEffect(() => {
    if (itemRef.current && hasChild && activeLevels[level] === item.id) {
      const rect = itemRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      
      // If menu would overflow on the right, show it on the left instead
      if (rect.right + 200 > windowWidth) {
        setPositionClass("right-full mr-1");
      } else {
        setPositionClass("left-full ml-1");
      }
    }
  }, [activeLevels, level, item.id, hasChild]);

  return (
    <li
      className="group relative"
      ref={itemRef}
      onMouseEnter={() => handleMouseEnter(level, item.id)}
      onMouseLeave={() => handleMouseLeave(level)}
    >
      <Link
        to={`/category/${slugPath}`}
        className={`flex items-center justify-between px-4 py-2 text-sm ${
          level === 1 
            ? "font-medium text-gray-800 hover:text-indigo-600" 
            : "text-gray-700 hover:bg-indigo-50"
        } rounded-md transition-colors duration-200`}
      >
        {item.name}
        {hasChild && (
          <FiChevronRight className="ml-2 text-gray-400 group-hover:text-indigo-500 text-xs" />
        )}
      </Link>

      {/* Submenu */}
      {hasChild && activeLevels[level] === item.id && (
        <div className={`absolute top-0 ${positionClass} z-50 animate-fadeIn`}>
          <ul className="bg-white shadow-xl rounded-lg py-2 px-1 min-w-[200px] border border-gray-100">
            {getChildren(item, level).map((child) => (
              <DesktopCategoryItem
                key={child.id}
                item={child}
                level={level + 1}
                parentSlug={slugPath}
                activeLevels={activeLevels}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
});

// Memoized category item component for mobile view
const MobileCategoryItem = memo(({ 
  item, 
  level, 
  parentSlug, 
  expandedCategories, 
  toggleCategory,
  setMobileMenuOpen
}) => {
  const getChildren = (item, level) => {
    if (level === 1) return item.subcategories || [];
    if (level === 2) return item.children || [];
    if (level === 3) return item.subchildren || [];
    if (level === 4) return item.subsubchildren || [];
    return [];
  };

  const itemSlug = `${item.slug}`;
  const children = getChildren(item, level);
  const hasChildItems = children && children.length > 0;
  const isExpanded = expandedCategories[`${level}-${item.id}`];
  const navigate = useNavigate();

  const handleItemClick = () => {
    navigate(`/category/${itemSlug}`);
    setMobileMenuOpen(false);
   
  };

  return (
    <li className="border-b border-gray-100 last:border-b-0">
      <div className="flex items-center justify-between py-3">
        <button
          onClick={handleItemClick}
          className={`flex-1 text-left ${
            level === 1 ? "font-medium text-gray-800" : "text-gray-700  sdasasa"
          }`}
        >
          {item.name}
        </button>
        {hasChildItems && (
          <button
            className="p-2 text-gray-500 hover:text-indigo-600 focus:outline-none transition-colors"
            onClick={() => toggleCategory(item.id, level)}
          >
            {isExpanded ? <FiMinus size={16} /> : <FiPlus size={16} />}
          </button>
        )}
      </div>

      {hasChildItems && isExpanded && (
        <div className="ml-4 mb-1">
          <ul className={`${level > 1 ? "border-l-2 border-gray-200 pl-4" : ""}`}>
            {children.map((child) => (
              <MobileCategoryItem
                key={child.id}
                item={child}
                level={level + 1}
                parentSlug={itemSlug}
                expandedCategories={expandedCategories}
                toggleCategory={toggleCategory}
                setMobileMenuOpen={setMobileMenuOpen}
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
});

const Navbar = () => {
  const [transformedCategories, setTransformedCategories] = useState([]);
  const { 
    categoryTree, 
    loading, 
    error, 
    initialized,
    loadCategoryTree 
  } = useCategory();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [activeLevels, setActiveLevels] = useState({});
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  
  // Track scroll position for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Transform categories into the required structure
  const transformCategories = useCallback((categories, level = 1) => {
    if (!categories) return [];
    
    return categories.map((category) => {
      const transformed = {
        id: category.id,
        name: category.name,
        slug: category.url_key,
      };
      const children = category.children_data;
      if (children && children.length > 0) {
        const childKey = getChildKey(level);
        transformed[childKey] = transformCategories(children, level + 1);
      }
      return transformed;
    });
  }, []);
  
  const getChildKey = useCallback((level) => {
    if (level === 1) return "subcategories";
    if (level === 2) return "children";
    return "sub" + "sub".repeat(level - 3) + "children";
  }, []);

  useEffect(() => {
    if (!initialized) {
      loadCategoryTree();
    }
  }, [initialized, loadCategoryTree]);

  useEffect(() => {
    if (categoryTree && categoryTree.children_data) {
      const transformed = transformCategories(categoryTree.children_data);
      setTransformedCategories(transformed);
    }
  }, [categoryTree, transformCategories]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveLevels({});
        if (window.innerWidth < 768) {
          setMobileMenuOpen(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Desktop handlers
  const handleMouseEnter = useCallback((level, id) => {
    if (window.innerWidth >= 768) {
      setActiveLevels((prev) => ({
        ...prev,
        [level]: id,
      }));
    }
  }, []);

  const handleMouseLeave = useCallback((level) => {
    if (window.innerWidth >= 768) {
      setActiveLevels((prev) => {
        const newLevels = { ...prev };
        Object.keys(newLevels)
          .filter((key) => parseInt(key) >= level)
          .forEach((key) => delete newLevels[key]);
        return newLevels;
      });
    }
  }, []);

  // Mobile handlers
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
    setExpandedCategories({});
  }, []);

  const toggleCategory = useCallback((id, level) => {
    setExpandedCategories((prev) => {
      const key = `${level}-${id}`;
      const newExpanded = { ...prev };
      
      if (newExpanded[key]) {
        // Collapse this category and all its children
        delete newExpanded[key];
        Object.keys(newExpanded).forEach(k => {
          if (k.startsWith(`${level + 1}-`)) delete newExpanded[k];
        });
      } else {
        // Expand this category and collapse siblings
        newExpanded[key] = true;
        Object.keys(newExpanded).forEach(k => {
          if (k.startsWith(`${level}-`) && k !== key) delete newExpanded[k];
        });
      }
      
      return newExpanded;
    });
  }, []);

  return (
    <nav 
      ref={navRef}
      className={`sticky top-0 z-50 bg-white ${
        scrolled ? "shadow-md" : "shadow-sm"
      } transition-shadow duration-300`}
    >
      <div className="container mx-auto px-4">
        {/* Mobile menu header */}
        <div className="md:hidden flex justify-between items-center py-3">
          <button
            className="text-gray-700 hover:text-indigo-600 focus:outline-none transition-colors"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          
          <div className="w-6"></div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="py-4 flex justify-center">
            <Loader size="md" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-4 text-red-600 bg-red-50 rounded-lg">
            Failed to load categories. Please try again.
          </div>
        )}

        {/* Mobile menu */}
        {!loading && !error && mobileMenuOpen && (
          <div className="md:hidden bg-white rounded-lg shadow-inner max-h-[calc(100vh-120px)] overflow-y-auto overscroll-contain">
            <ul className="p-3">
              {transformedCategories.map((item) => (
                <MobileCategoryItem
                  key={item.id}
                  item={item}
                  level={1}
                  parentSlug=""
                  expandedCategories={expandedCategories}
                  toggleCategory={toggleCategory}
                  setMobileMenuOpen={setMobileMenuOpen}
                />
              ))}
            </ul>
          </div>
        )}

        {/* Desktop menu */}
        {!loading && !error && (
          <ul className="hidden md:flex justify-center space-x-1">
            {transformedCategories.map((cat) => (
              <li
                key={cat.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(1, cat.id)}
                onMouseLeave={() => handleMouseLeave(1)}
              >
                <NavLink
                  to={`/category/${cat.slug || cat.id}`}
                  className={`block px-5 py-4 font-medium text-gray-800 hover:text-indigo-600 ${
                    activeLevels[1] === cat.id ? "text-indigo-600" : ""
                  } transition-colors duration-200`}
                >
                  {cat.name}
                </NavLink>

                {cat.subcategories?.length > 0 && activeLevels[1] === cat.id && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 z-50">
                    <ul className="bg-white shadow-xl rounded-lg py-2 px-1 min-w-[200px] border border-gray-100 animate-fadeIn">
                      {cat.subcategories.map((subcat) => (
                        <DesktopCategoryItem
                          key={subcat.id}
                          item={subcat}
                          level={2}
                          parentSlug={cat.slug || cat.id}
                          activeLevels={activeLevels}
                          handleMouseEnter={handleMouseEnter}
                          handleMouseLeave={handleMouseLeave}
                        />
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default React.memo(Navbar);