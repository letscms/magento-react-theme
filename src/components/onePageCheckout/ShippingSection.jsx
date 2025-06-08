import React, { memo } from 'react';
import { formatPrice } from '../../utils/formatters';
import LoadingSpinner from '../../utils/Loader'; // Assuming this is the correct path

const ShippingSectionInternal = ({
  shippingMethods,
  selectedShippingMethod,
  setSelectedShippingMethod,
  sectionCompleted,
  sectionExpanded,
  toggleSection,
  saveShippingMethod,
  sectionLoading // This prop was in the original, ensure it's passed from OnePageCheckout
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
      <div 
        className={`p-4 border-b cursor-pointer flex justify-between items-center ${sectionCompleted.shipping ? 'bg-green-50' : ''} ${!sectionCompleted.address ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => sectionCompleted.address && toggleSection('shipping')} // Only allow toggle if address is complete
      >
        <h2 className="text-lg font-semibold">
          {sectionCompleted.shipping ? (
            <span className="text-green-600">✓ </span>
          ) : (
            <span className="text-gray-400">2. </span>
          )}
          Shipping Method
        </h2>
        <svg 
          className={`h-5 w-5 transform ${sectionExpanded.shipping ? 'rotate-180' : ''}`} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
      
      {sectionExpanded.shipping && sectionCompleted.address && ( // Only expand if address is complete
        <div className="p-6">
          {sectionLoading ? ( // Use the specific sectionLoading prop
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {!shippingMethods || shippingMethods.length === 0 ? (
                <p className="text-gray-500 italic">
                  No shipping methods available for your address, or address not yet provided.
                </p>
              ) : (
                <div className="space-y-3">
                  {shippingMethods.map(method => (
                    <div key={`${method.carrier_code}_${method.method_code}`} className="flex items-center p-3 border rounded-md hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        id={`${method.carrier_code}_${method.method_code}`}
                        name="shipping_method"
                        checked={selectedShippingMethod && 
                          selectedShippingMethod.carrier_code === method.carrier_code && 
                          selectedShippingMethod.method_code === method.method_code}
                        onChange={() => setSelectedShippingMethod(method)}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor={`${method.carrier_code}_${method.method_code}`} className="ml-3 flex flex-1 justify-between cursor-pointer">
                        <div>
                          <span className="block text-sm font-medium text-gray-700">{method.carrier_title}</span>
                          <span className="block text-sm text-gray-500">{method.method_title}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {method.amount ? formatPrice(method.amount) : (method.price_incl_tax ? formatPrice(method.price_incl_tax) : 'N/A')}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
              
              {shippingMethods && shippingMethods.length > 0 && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={saveShippingMethod}
                    disabled={sectionLoading || !selectedShippingMethod}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {sectionLoading ? 'Processing...' : 'Continue to Payment'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

const ShippingSection = memo(ShippingSectionInternal);

export default ShippingSection;