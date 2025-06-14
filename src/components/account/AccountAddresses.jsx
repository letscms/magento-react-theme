import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getAddresses, deleteAddress, setDefaultAddress } from '../../api/addressApi';
import AddressForm from './AddressForm';
import ErrorBoundary from '../ErrorBoundary';

function AccountAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Simple debounce implementation
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Debounced loadAddresses
  const loadAddresses = useCallback(
    debounce(async () => {
      try {
        setLoading(true);
        const data = await getAddresses();
        setAddresses(data.addresses || []);
        setError(null);
      } catch (err) {
        setError('Failed to load addresses. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    loadAddresses();
    return () => clearTimeout(loadAddresses); // Cleanup debounce
  }, [loadAddresses]);

  const handleAddNew = useCallback(() => {
    setEditingAddress(null);
    setShowAddForm(true);
  }, []);

  const handleEdit = useCallback((address) => {
    setEditingAddress(address);
    setShowAddForm(true);
  }, []);

  const handleDelete = useCallback(async (addressId) => {
    if (!addressId || !window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await deleteAddress(addressId);
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
      setError(null);
    } catch (err) {
      setError('Failed to delete address. Please try again.');
      console.error('Error in deleteAddress:', err);
    }
  }, []);

  const handleSetDefault = useCallback(async (addressId, type) => {
    try {
      await setDefaultAddress(addressId, type);
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          default_billing: type === 'billing' ? addr.id === addressId : addr.default_billing,
          default_shipping: type === 'shipping' ? addr.id === addressId : addr.default_shipping,
        }))
      );
      setError(null);
    } catch (err) {
      setError(`Failed to set default ${type} address. Please try again.`);
      console.error(err);
    }
  }, []);

  const handleFormSubmit = useCallback(() => {
    setShowAddForm(false);
    setEditingAddress(null);
    loadAddresses();
  }, [loadAddresses]);

  const handleFormCancel = useCallback(() => {
    setShowAddForm(false);
    setEditingAddress(null);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
      <style>
        {`
          .fade-in {
            animation: fadeIn 0.3s ease-in;
          }
          .address-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .address-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .form-enter {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            transition: max-height 0.3s ease, opacity 0.3s ease;
          }
          .form-enter-active {
            max-height: 500px;
            opacity: 1;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Address Book</h2>
          <button
            onClick={handleAddNew}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out text-sm"
            aria-label="Add new address"
          >
            Add New Address
          </button>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 fade-in"
            role="alert"
          >
            {error}
          </div>
        )}

        {showAddForm ? (
          <div className={`form-enter ${showAddForm ? 'form-enter-active' : ''}`}>
            <ErrorBoundary>
              <AddressForm
                initialData={editingAddress}
                onSuccess={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </ErrorBoundary>
          </div>
        ) : null}

        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-8 text-gray-500 fade-in">
            <p>You have no saved addresses.</p>
            <button
              onClick={handleAddNew}
              className="mt-4 text-indigo-600 hover:text-indigo-800 underline text-sm"
              aria-label="Add your first address"
            >
              Add your first address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((address) => (
              <div key={address.id} className="border rounded-lg p-4 bg-white address-card">
                <div className="flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg text-gray-800">
                      {address.firstname} {address.lastname}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(address)}
                        className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                        aria-label={`Edit address for ${address.firstname} ${address.lastname}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="text-sm text-red-600 hover:text-red-800 transition-colors"
                        aria-label={`Delete address for ${address.firstname} ${address.lastname}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="text-gray-600 mb-4 text-sm">
                    <p>{Array.isArray(address.street) ? address.street.join(', ') : address.street}</p>
                    <p>
                      {address.city}, {address.region?.region || address.region} {address.postcode}
                    </p>
                    <p>{address.country_id}</p>
                    <p>T: {address.telephone}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {address.default_shipping && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Default Shipping
                      </span>
                    )}
                    {address.default_billing && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        Default Billing
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {!address.default_shipping && (
                      <button
                        onClick={() => handleSetDefault(address.id, 'shipping')}
                        className="text-xs text-indigo-600 hover:text-indigo-800 underline"
                        aria-label={`Set as default shipping address for ${address.firstname} ${address.lastname}`}
                      >
                        Use as shipping address
                      </button>
                    )}
                    {!address.default_billing && (
                      <button
                        onClick={() => handleSetDefault(address.id, 'billing')}
                        className="text-xs text-indigo-600 hover:text-indigo-800 underline"
                        aria-label={`Set as default billing address for ${address.firstname} ${address.lastname}`}
                      >
                        Use as billing address
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(AccountAddresses);