import React, { memo } from 'react';
import LoadingSpinner from '../../utils/Loader'; // Assuming this is the correct path

const PaymentSectionInternal = ({
  paymentMethods,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  sectionCompleted,
  sectionExpanded,
  toggleSection,
  savePaymentMethod,
  sectionLoading // This prop was in the original, ensure it's passed from OnePageCheckout
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
      <div 
        className={`p-4 border-b cursor-pointer flex justify-between items-center ${sectionCompleted.payment ? 'bg-green-50' : ''} ${!sectionCompleted.shipping ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => sectionCompleted.shipping && toggleSection('payment')} // Only allow toggle if shipping is complete
      >
        <h2 className="text-lg font-semibold">
          {sectionCompleted.payment ? (
            <span className="text-green-600">✓ </span>
          ) : (
            <span className="text-gray-400">3. </span>
          )}
          Payment Method
        </h2>
        <svg 
          className={`h-5 w-5 transform ${sectionExpanded.payment ? 'rotate-180' : ''}`} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
      
      {sectionExpanded.payment && sectionCompleted.shipping && ( // Only expand if shipping is complete
        <div className="p-6">
          {sectionLoading ? ( // Use the specific sectionLoading prop
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {!paymentMethods || paymentMethods.length === 0 ? (
                <p className="text-gray-500 italic">
                  No payment methods available. Please ensure shipping is completed.
                </p>
              ) : (
                <div className="space-y-4">
                  {paymentMethods.map(method => (
                    <div key={method.code} className="border rounded-md p-4 hover:border-blue-500 transition-colors cursor-pointer" onClick={() => setSelectedPaymentMethod(method)}>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id={method.code}
                          name="payment_method"
                          checked={selectedPaymentMethod && selectedPaymentMethod.code === method.code}
                          onChange={() => setSelectedPaymentMethod(method)} // Already handled by div click, but good for accessibility
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <label htmlFor={method.code} className="ml-3 flex flex-1 cursor-pointer">
                          <div>
                            <span className="block text-sm font-medium text-gray-700">{method.title}</span>
                            {/* Placeholder for method-specific descriptions or components */}
                            {method.code === 'checkmo' && (
                                <span className="block text-xs text-gray-500 mt-1">Pay by Check or Money Order.</span>
                            )}
                             {method.code === 'cashondelivery' && (
                                <span className="block text-xs text-gray-500 mt-1">Pay on delivery.</span>
                            )}
                          </div>
                        </label>
                      </div>
                      
                      {/* Placeholder for Braintree or other integrated payment forms */}
                      {selectedPaymentMethod && selectedPaymentMethod.code === method.code && method.code === 'braintree_cc_vault' && (
                        <div className="mt-4 ml-7 text-sm text-gray-600">
                           {/* This is where Braintree's Drop-in UI or Hosted Fields would be rendered. */}
                           {/* For now, a placeholder: */}
                           <p className="italic">Braintree credit card form would appear here.</p>
                           {/* Example fields (not functional without integration) */}
                           <div className="mt-2 space-y-2">
                               <div>
                                   <label htmlFor="braintree_card_number" className="text-xs">Card Number</label>
                                   <input type="text" id="braintree_card_number" className="w-full p-1 border rounded-sm text-xs" placeholder="•••• •••• •••• ••••" />
                               </div>
                               <div>
                                   <label htmlFor="braintree_expiry" className="text-xs">Expiry</label>
                                   <input type="text" id="braintree_expiry" className="w-full p-1 border rounded-sm text-xs" placeholder="MM/YY" />
                               </div>
                               <div>
                                   <label htmlFor="braintree_cvv" className="text-xs">CVV</label>
                                   <input type="text" id="braintree_cvv" className="w-full p-1 border rounded-sm text-xs" placeholder="•••" />
                               </div>
                           </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {paymentMethods && paymentMethods.length > 0 && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={savePaymentMethod}
                    disabled={sectionLoading || !selectedPaymentMethod}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {sectionLoading ? 'Processing...' : 'Continue to Review Order'}
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

const PaymentSection = memo(PaymentSectionInternal);

export default PaymentSection;