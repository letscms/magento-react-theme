import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const CartIcon = () => {
  const { getCartItemCount, loading } = useCart();
  const itemCount = getCartItemCount();

  return (
    <Link to="/cart" className="p-2 hover:text-blue-600 relative">
      <i className="fas fa-shopping-cart"></i>
      {!loading && itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {itemCount}
        </span>
      )}
    </Link>
  );
};

export default React.memo(CartIcon);