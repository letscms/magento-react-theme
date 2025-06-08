import React, { useState, useEffect } from 'react';
import { getAddresses, deleteAddress, setDefaultAddress } from '../../api/addressApi';
import AddressForm from './AddressForm';
import ErrorBoundary from '../ErrorBoundary';

function AccountAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const data = await getAddresses();   
      setAddresses(data.addresses);   
      setError(null);
    } catch (err) {
      setError('Failed to load addresses. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setShowAddForm(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const handleDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        // Make sure we're passing a valid addressId to the deleteAddress function
        if (!addressId) {
          throw new Error('Invalid address ID');
        }
        
        await deleteAddress(addressId);
        
        // Update the addresses state by filtering out the deleted address
        setAddresses(addresses.filter(addr => addr.id !== addressId));
        
      } catch (err) {
        setError('Failed to delete address. Please try again.');
        console.error('Error in deleteAddress:', err);
      }
    }
  };

  const handleSetDefault = async (addressId, type) => {
    try {
      await setDefaultAddress(addressId, type);
      
      // Update local state to reflect the change
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        default_billing: type === 'billing' ? addr.id === addressId : addr.default_billing,
        default_shipping: type === 'shipping' ? addr.id === addressId : addr.default_shipping
      }));
      
      setAddresses(updatedAddresses);
    } catch (err) {
      setError(`Failed to set default ${type} address. Please try again.`);
      console.error(err);
    }
  };

  const handleFormSubmit = () => {
    setShowAddForm(false);
    loadAddresses(); // Reload addresses after form submission
  };
  
  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingAddress(null);
  };

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium text-gray-800">Address Book</h2>
        <button
          onClick={handleAddNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out"
        >
          Add New Address
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showAddForm ? (
        <ErrorBoundary>
          <AddressForm 
            initialData={editingAddress} 
            onSuccess={handleFormSubmit} 
            onCancel={handleFormCancel}
          />
        </ErrorBoundary>
      ) : (
        <>
          {addresses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>You have no saved addresses.</p>
              <button
                onClick={handleAddNew}
                className="mt-4 text-indigo-600 hover:text-indigo-800 underline"
              >
                Add your first address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map(address => (
                <div key={address.id} className="border rounded-lg p-4 relative">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-lg">{address.firstname} {address.lastname}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(address)}
                          className="text-sm text-gray-600 hover:text-indigo-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(address.id)}
                          className="text-sm text-gray-600 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="text-gray-600 mb-4">
                      <p>{Array.isArray(address.street) ? address.street.join(', ') : address.street}</p>
                      <p>{address.city}, {address.region?.region || address.region} {address.postcode}</p>
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
                          className="text-xs text-gray-600 hover:text-indigo-600 underline"
                        >
                          Use as shipping address
                        </button>
                      )}
                      {!address.default_billing && (
                        <button
                          onClick={() => handleSetDefault(address.id, 'billing')}
                          className="text-xs text-gray-600 hover:text-indigo-600 underline"
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
        </>
      )}
    </div>
  );
}

export default React.memo(AccountAddresses);
