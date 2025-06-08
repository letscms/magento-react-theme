import React, { useState } from 'react';
import useCart from '../../hooks/useCart';

const CartItem = ({ item }) => {
  const { updateItemQuantity, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Handle quantity change
  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity === item.qty || newQuantity < 1 || isUpdating) return;
    
    try {
      setIsUpdating(true);
      await updateItemQuantity(item.item_id, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle item removal
  const handleRemove = async () => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      await removeItem(item.item_id);
    } catch (error) {
      console.error('Failed to remove item:', error);
      setIsUpdating(false);
    }
  };
  
  // Calculate item total price
  const itemTotal = (item.price * item.qty).toFixed(2);
  
  return (
    <div className="cart-item">
      <div className="item-image">
        {item.image ? (
          <img src={item.image} alt={item.name}  loading="lazy"/>
        ) : (
          <div className="placeholder-image">No Image</div>
        )}
      </div>
      
      <div className="item-details">
        <h3 className="item-name">{item.name}</h3>
        <p className="item-sku">SKU: {item.sku}</p>
        {item.options && item.options.length > 0 && (
          <div className="item-options">
            {item.options.map((option, index) => (
              <span key={index} className="item-option">
                {option.label}: {option.value}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="item-price">
        <span>${item.price.toFixed(2)}</span>
      </div>
      
      <div className="item-quantity">
        <button 
          className="quantity-btn decrease"
          onClick={() => handleQuantityChange(item.qty - 1)}
          disabled={isUpdating || item.qty <= 1}
        >
          -
        </button>
        
        <span className="quantity-value">
          {isUpdating ? (
            <span className="quantity-updating">...</span>
          ) : (
            item.qty
          )}
        </span>
        
        <button 
          className="quantity-btn increase"
          onClick={() => handleQuantityChange(item.qty + 1)}
          disabled={isUpdating || item.qty >= 99}
        >
          +
        </button>
      </div>
      
      <div className="item-total">
        <span>${itemTotal}</span>
      </div>
      
      <div className="item-actions">
        <button 
          className="remove-item"
          onClick={handleRemove}
          disabled={isUpdating}
        >
          {isUpdating ? 'Removing...' : 'Remove'}
        </button>
      </div>
    </div>
  );
};

export default React.memo(CartItem);