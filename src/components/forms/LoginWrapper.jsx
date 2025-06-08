import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../hooks/useAuth';
import { CartProvider } from '../../hooks/useCart';
import { WishlistProvider } from '../../context/WishlistContext';
import Loginforms from './Loginforms';

const LoginWrapper = () => {
  return (
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-center mb-6">
                Login to Continue Shopping
              </h2>
              <Loginforms />
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
};

export default LoginWrapper;