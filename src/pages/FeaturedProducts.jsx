import React from 'react';
import { Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
// import AddToCartButton from '../components/cart/AddToCartButton';

const FeaturedProducts = ({ title = "Featured Products", count = 8 }) => {
  const { products, loading, error, } = useProduct(count);

  // Format price with currency symbol
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Find product image
  const getProductImage = (product) => {
    if (!product.media_gallery_entries || product.media_gallery_entries.length === 0) {
      return '/placeholder-image.jpg'; // Default placeholder
    }
    
    const mainImage = product.media_gallery_entries.find(img => img.types.includes('image') || img.types.includes('small_image'));
    if (mainImage) {
      return `/media/catalog/product${mainImage.file}`;
    }
    
    return `/media/catalog/product${product.media_gallery_entries[0].file}`;
  };

  // Find custom attribute value
  const getAttributeValue = (product, attributeCode) => {
    if (!product.custom_attributes) return null;
    
    const attribute = product.custom_attributes.find(attr => attr.attribute_code === attributeCode);
    return attribute ? attribute.value : null;
  };

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <ErrorMessage message={error.message || "Failed to load featured products. Please try again later."} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <p className="text-gray-500">No featured products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => {
          const urlKey = getAttributeValue(product, 'url_key') || product.sku;
          const imageUrl = getProductImage(product);
          const specialPrice = getAttributeValue(product, 'special_price');
          
          return (
            <div key={product.id} className="group">
              <Link to={`/product/${urlKey}`} className="block">
                <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square mb-3 relative">
                  <img 
                    src={imageUrl} 
                    alt={product.name} 
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                  
                  {/* Sale badge */}
                  {specialPrice && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      SALE
                    </div>
                  )}
                  
                  {/* Quick view button - optional */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Quick View
                  </div>
                </div>
                
                <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2 group-hover:text-indigo-600">
                  {product.name}
                </h3>
                
                <div className="flex items-center">
                  {specialPrice ? (
                    <>
                      <span className="text-red-600 font-medium mr-2">
                        {formatPrice(specialPrice)}
                      </span>
                      <span className="text-gray-500 text-sm line-through">
                        {formatPrice(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-800 font-medium">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
              </Link>
              
              {/* <AddToCartButton 
                product={product} 
                className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors duration-300"
              /> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedProducts;
