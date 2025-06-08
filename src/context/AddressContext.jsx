import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getAddresses, addAddress, updateAddress, deleteAddress as apiDeleteAddress } from '../api/addressApi';

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    setError(null);  
    try {
      const data = await getAddresses();         
      setAddresses(data?.addresses || []);
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
      setError(err.message || 'Failed to fetch addresses');
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchAddresses();
    } else {
      setAddresses([]);
    }
  }, [fetchAddresses]);

  const handleAddAddress = async (addressData) => {
    setLoading(true);
    setError(null);
    try {
      const newAddress = await addAddress(addressData);
      setAddresses(prev => [...prev, newAddress]);
      return newAddress;
    } catch (err) {
      console.error("Failed to add address:", err);
      setError(err.message || 'Failed to add address');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async (addressData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedAddr = await updateAddress(addressData);
      setAddresses(prev => prev.map(addr => (addr.id === updatedAddr.id ? updatedAddr : addr)));
      return updatedAddr;
    } catch (err) {
      console.error("Failed to update address:", err);
      setError(err.message || 'Failed to update address');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    setLoading(true);
    setError(null);
    try {
      await apiDeleteAddress(addressId);
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    } catch (err) {
      console.error("Failed to delete address:", err);
      setError(err.message || 'Failed to delete address');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        loading,
        error,
        fetchAddresses,
        addAddress: handleAddAddress,
        updateAddress: handleUpdateAddress,
        deleteAddress: handleDeleteAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
};