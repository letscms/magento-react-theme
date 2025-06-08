import React from 'react';

const PaymentStep = ({
  paymentMethods,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  onContinue,
  onBack,
  loading
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
      
      {/* Payment Methods */}
      <div className="mb-8">
        {paymentMethods.length === 0 ? (
          <p className="text-gray-500 italic">
            No payment methods available. Please try again or contact customer support.
          </p>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map(method => (
              <div key={method.code} className="border rounded-md p-4 hover:border-blue-500 transition-colors">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id={method.code}
                    name="payment_method"
                    checked={selectedPaymentMethod && selectedPaymentMethod.code === method.code}
                    onChange={() => setSelectedPaymentMethod(method)}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor={method.code} className="ml-3 flex flex-1">
                    <div>
                      <span className="block text-sm font-medium text-gray-700">{method.title}</span>
                      {method.description && (
                        <span className="block text-sm text-gray-500 mt-1">{method.description}</span>
                      )}
                    </div>
                  </label>
                </div>
                
                {/* Credit Card Form (if selected and is credit card) */}
                {selectedPaymentMethod && 
                 selectedPaymentMethod.code === method.code && 
                 method.code === 'checkmo' && (
                  <div className="mt-4 ml-7 text-sm text-gray-600">
                    <p>You will receive payment instructions after placing the order.</p>
                  </div>
                )}
                
                {/* Credit Card Form (placeholder for integration with actual payment processors) */}
                {selectedPaymentMethod && 
                 selectedPaymentMethod.code === method.code && 
                 method.code === 'braintree' && (
                  <div className="mt-4 ml-7">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label htmlFor="cc_number" className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="cc_number"
                          placeholder="•••• •••• •••• ••••"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cc_exp" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiration Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="cc_exp"
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cc_cvc" className="block text-sm font-medium text-gray-700 mb-1">
                          CVC/CVV <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="cc_cvc"
                          placeholder="•••"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Back to Shipping
        </button>
        
        <button
          type="button"
          onClick={onContinue}
          disabled={loading || !selectedPaymentMethod}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Review Order'}
        </button>
      </div>
    </div>
  );
};

export default React.memo(PaymentStep);