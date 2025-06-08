import React from 'react';
import { formatPrice } from '../../utils/formatters';

const ShippingStep = ({
  shippingAddress,
  billingAddress,
  handleShippingAddressChange,
  handleBillingAddressChange,
  toggleSameAsBilling,
  countries,
  shippingMethods,
  selectedShippingMethod,
  setSelectedShippingMethod,
  onContinue,
  loading
}) => {
  // Find country name by ID
  const getCountryName = (countryId) => {
    const country = countries.find(c => c.id === countryId);
    return country ? country.full_name_english : countryId;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
      
      {/* Shipping Address Form */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstname"
              value={shippingAddress.firstname}
              onChange={(e) => handleShippingAddressChange('firstname', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          {/* Last Name */}
          <div>
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastname"
              value={shippingAddress.lastname}
              onChange={(e) => handleShippingAddressChange('lastname', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          {/* Street Address Line 1 */}
          <div className="md:col-span-2">
            <label htmlFor="street1" className="block text-sm font-medium text-gray-700 mb-1">
              Street Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="street1"
              value={shippingAddress.street[0]}
              onChange={(e) => handleShippingAddressChange('street[0]', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Street address, P.O. box, company name"
              required
            />
          </div>
          
          {/* Street Address Line 2 */}
          <div className="md:col-span-2">
            <input
              type="text"
              id="street2"
              value={shippingAddress.street[1]}
              onChange={(e) => handleShippingAddressChange('street[1]', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 mt-2"
              placeholder="Apartment, suite, unit, building, floor, etc."
            />
          </div>
          
          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              value={shippingAddress.city}
              onChange={(e) => handleShippingAddressChange('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          {/* State/Province */}
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
              State/Province <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="region"
              value={shippingAddress.region}
              onChange={(e) => handleShippingAddressChange('region', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          {/* Zip/Postal Code */}
          <div>
            <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-1">
              Zip/Postal Code <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="postcode"
              value={shippingAddress.postcode}
              onChange={(e) => handleShippingAddressChange('postcode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          {/* Country */}
          <div>
            <label htmlFor="country_id" className="block text-sm font-medium text-gray-700 mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              id="country_id"
              value={shippingAddress.country_id}
              onChange={(e) => handleShippingAddressChange('country_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country.id} value={country.id}>
                  {country.full_name_english}
                </option>
              ))}
            </select>
          </div>
          
          {/* Phone Number */}
          <div>
            <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="telephone"
              value={shippingAddress.telephone}
              onChange={(e) => handleShippingAddressChange('telephone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={shippingAddress.email}
              onChange={(e) => handleShippingAddressChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        {/* Same as Billing Checkbox */}
        <div className="mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={shippingAddress.same_as_billing}
              onChange={toggleSameAsBilling}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">Billing address same as shipping address</span>
          </label>
        </div>
      </div>
      
      {/* Billing Address Form (if different from shipping) */}
      {!shippingAddress.same_as_billing && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Billing Address</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label htmlFor="billing_firstname" className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="billing_firstname"
                value={billingAddress.firstname}
                onChange={(e) => handleBillingAddressChange('firstname', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* Last Name */}
            <div>
              <label htmlFor="billing_lastname" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="billing_lastname"
                value={billingAddress.lastname}
                onChange={(e) => handleBillingAddressChange('lastname', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* Street Address Line 1 */}
            <div className="md:col-span-2">
              <label htmlFor="billing_street1" className="block text-sm font-medium text-gray-700 mb-1">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="billing_street1"
                value={billingAddress.street[0]}
                onChange={(e) => handleBillingAddressChange('street[0]', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Street address, P.O. box, company name"
                required
              />
            </div>
            
            {/* Street Address Line 2 */}
            <div className="md:col-span-2">
              <input
                type="text"
                id="billing_street2"
                value={billingAddress.street[1]}
                onChange={(e) => handleBillingAddressChange('street[1]', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 mt-2"
                placeholder="Apartment, suite, unit, building, floor, etc."
              />
            </div>
            
            {/* City */}
            <div>
              <label htmlFor="billing_city" className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="billing_city"
                value={billingAddress.city}
                onChange={(e) => handleBillingAddressChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* State/Province */}
            <div>
              <label htmlFor="billing_region" className="block text-sm font-medium text-gray-700 mb-1">
                State/Province <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="billing_region"
                value={billingAddress.region}
                onChange={(e) => handleBillingAddressChange('region', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* Zip/Postal Code */}
            <div>
              <label htmlFor="billing_postcode" className="block text-sm font-medium text-gray-700 mb-1">
                Zip/Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="billing_postcode"
                value={billingAddress.postcode}
                onChange={(e) => handleBillingAddressChange('postcode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* Country */}
            <div>
              <label htmlFor="billing_country_id" className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                id="billing_country_id"
                value={billingAddress.country_id}
                onChange={(e) => handleBillingAddressChange('country_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country.id} value={country.id}>
                    {country.full_name_english}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Phone Number */}
            <div>
              <label htmlFor="billing_telephone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="billing_telephone"
                value={billingAddress.telephone}
                onChange={(e) => handleBillingAddressChange('telephone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="billing_email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="billing_email"
                value={billingAddress.email}
                onChange={(e) => handleBillingAddressChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Shipping Methods */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Shipping Method</h3>
        
        {shippingMethods.length === 0 ? (
          <p className="text-gray-500 italic">
            Please enter your shipping address to see available shipping methods.
          </p>
        ) : (
          <div className="space-y-3">
            {shippingMethods.map(method => (
              <div key={`${method.carrier_code}_${method.method_code}`} className="flex items-center">
                <input
                  type="radio"
                  id={`${method.carrier_code}_${method.method_code}`}
                  name="shipping_method"
                  checked={selectedShippingMethod && 
                    selectedShippingMethod.carrier_code === method.carrier_code && 
                    selectedShippingMethod.method_code === method.method_code}
                  onChange={() => setSelectedShippingMethod(method)}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor={`${method.carrier_code}_${method.method_code}`} className="ml-3 flex flex-1 justify-between">
                  <div>
                    <span className="block text-sm font-medium text-gray-700">{method.carrier_title}</span>
                    <span className="block text-sm text-gray-500">{method.method_title}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {formatPrice(method.amount)}
                  </span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Continue Button */}
      <div className="mt-8">
        <button
          type="button"
          onClick={onContinue}
          disabled={loading || shippingMethods.length === 0}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Continue to Payment'}
        </button>
      </div>
    </div>
  );
};

export default React.memo(ShippingStep);