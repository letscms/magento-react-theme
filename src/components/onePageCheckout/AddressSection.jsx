import React, { useEffect, useState, useCallback, memo } from "react";
import { fetchRegionsByCountry } from "../../api/addressApi";
import { useAddress } from "../../context/AddressContext"; // Assuming this context provides `addresses` and `fetchAddresses`
import { useAuth } from "../../hooks/useAuth";

const AddressSectionInternal = ({
  shippingAddress,
  billingAddress,
  handleShippingAddressChange,
  handleBillingAddressChange,
  toggleSameAsBilling,
  countries,
  sectionCompleted,
  sectionExpanded,
  toggleSection,
  saveShippingAddress,
  sectionLoading, // This prop was in the original, ensure it's passed from OnePageCheckout
}) => {
  const [regionsShipping, setRegionsShipping] = useState([]);
  const [regionsBilling, setRegionsBilling] = useState([]);
  const { currentUser, isAuthenticated } = useAuth();
  const { addresses, fetchAddresses } = useAddress(); // From context
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState("");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false); // Default to false, logic below will adjust

  useEffect(() => {
    if (isAuthenticated()) {
      fetchAddresses(); // Fetch addresses if user is authenticated
    }
  }, [isAuthenticated, fetchAddresses]);

  // Effect to decide whether to show the new address form based on fetched addresses
  useEffect(() => {
    if (isAuthenticated()) {
      if (addresses && addresses.length > 0) {
        setShowNewAddressForm(false); // Hide form if addresses exist
        // Check if a default shipping address exists and pre-select it
        const defaultShipping = addresses.find(addr => addr.default_shipping);
        if (defaultShipping) {
          setSelectedSavedAddressId(defaultShipping.id.toString());
          // Populate form with default shipping address
          // The parent `handleShippingAddressChange` should handle full object update
          handleShippingAddressChange(formatAddressForForm(defaultShipping), null, true);
          if (defaultShipping.country_id) {
            handleCountryChange(defaultShipping.country_id, "shipping");
          }
        } else {
            // If no default, but addresses exist, still hide form, user can pick or add new
            setSelectedSavedAddressId(""); // No specific address selected initially
        }
      } else {
        setShowNewAddressForm(true); // Show form if no addresses exist
        setSelectedSavedAddressId("new"); // Indicate new address mode
      }
    } else {
      setShowNewAddressForm(true); // Always show form for guests
      setSelectedSavedAddressId("new");
    }
  }, [isAuthenticated, addresses, handleShippingAddressChange]); // Added handleShippingAddressChange to deps for pre-fill

  const formatAddressForForm = useCallback(
    (address) => {
      if (!address) return {}; // Return empty object for new/empty address
      return {
        firstname: address.firstname || "",
        lastname: address.lastname || "",
        street: Array.isArray(address.street)
          ? [address.street[0] || "", address.street[1] || ""]
          : [(address.street || ""), ""], // Handle if street is single string or not array
        city: address.city || "",
        postcode: address.postcode || "",
        country_id: address.country_id || "",
        telephone: address.telephone || "",
        email: address.email || currentUser?.email || "",
        region: address.region?.region || (typeof address.region === 'string' ? address.region : "") || "",
        region_id: address.region?.region_id || address.region_id || "",
        // save_in_address_book is part of shippingAddress state in parent, not directly formatted here
      };
    },
    [currentUser]
  );

  const handleCountryChange = useCallback(async (countryId, type) => {
    if (!countryId) {
      if (type === "shipping") setRegionsShipping([]);
      if (type === "billing") setRegionsBilling([]);
      return;
    }
    try {
      const regions = await fetchRegionsByCountry(countryId);
      if (type === "shipping") setRegionsShipping(regions || []);
      if (type === "billing") setRegionsBilling(regions || []);
    } catch (error) {
      console.error(`Failed to fetch regions for ${type}:`, error);
      if (type === "shipping") setRegionsShipping([]);
      if (type === "billing") setRegionsBilling([]);
    }
  }, []);

  const handleSavedAddressSelection = useCallback(
    async (addressId) => {
      setSelectedSavedAddressId(addressId);
      setShowNewAddressForm(addressId === "new");

      if (addressId === "new") {
        const emptyAddress = formatAddressForForm({ email: currentUser?.email }); // Pre-fill email for new
        handleShippingAddressChange(emptyAddress, null, true); // true for full object update
        setRegionsShipping([]);
        if (shippingAddress.same_as_billing) {
          handleBillingAddressChange(emptyAddress, null, true);
          setRegionsBilling([]);
        }
      } else {
        const selectedAddress = addresses.find((addr) => addr.id.toString() === addressId);
        if (selectedAddress) {
          const formattedAddress = formatAddressForForm(selectedAddress);
          handleShippingAddressChange(formattedAddress, null, true);
          if (formattedAddress.country_id) {
            await handleCountryChange(formattedAddress.country_id, "shipping");
          }
          if (shippingAddress.same_as_billing) {
            handleBillingAddressChange(formattedAddress, null, true);
            if (formattedAddress.country_id) {
              await handleCountryChange(formattedAddress.country_id, "billing");
            }
          }
        }
      }
    },
    [
      addresses,
      formatAddressForForm,
      handleShippingAddressChange,
      handleBillingAddressChange,
      handleCountryChange,
      shippingAddress.same_as_billing,
      currentUser?.email,
    ]
  );
  
  // Simplified: just call handleSavedAddressSelection with "new"
  const handleAddNewAddressClick = useCallback(() => {
    handleSavedAddressSelection("new");
  }, [handleSavedAddressSelection]);


  return (
    <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
      <div
        className={`p-4 border-b cursor-pointer flex justify-between items-center ${
          sectionCompleted.address ? "bg-green-50" : ""
        }`}
        onClick={() => toggleSection("address")}
      >
        <h2 className="text-lg font-semibold">
          {sectionCompleted.address ? (
            <span className="text-green-600">✓ </span>
          ) : (
            <span className="text-gray-400">1. </span>
          )}
          Shipping Address
        </h2>
        <svg
          className={`h-5 w-5 transform ${
            sectionExpanded.address ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {sectionExpanded.address && (
        <div className="p-6">
          {isAuthenticated() && addresses.length > 0 && (
            <div className="mb-6">
              <label htmlFor="saved_address_select" className="block text-sm font-medium text-gray-700 mb-1">
                Select a Saved Address or Add New
              </label>
              <select
                id="saved_address_select"
                value={selectedSavedAddressId}
                onChange={(e) => handleSavedAddressSelection(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">--- Select Address ---</option>
                {addresses.map((addr) => (
                  <option key={addr.id} value={addr.id.toString()}>
                    {`${addr.firstname} ${addr.lastname}, ${addr.street.join(", ")}, ${addr.city}, ${addr.region?.region || addr.region || ''} ${addr.postcode}, ${addr.country_id}`}
                  </option>
                ))}
                <option value="new">-- Add New Address --</option>
              </select>
            </div>
          )}

          {(showNewAddressForm || !isAuthenticated() || (isAuthenticated() && addresses.length === 0 && selectedSavedAddressId === "new") ) && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    value={shippingAddress.firstname}
                    onChange={(e) => handleShippingAddressChange("firstname", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    value={shippingAddress.lastname}
                    onChange={(e) => handleShippingAddressChange("lastname", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="street1" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="street1"
                    name="street[0]"
                    value={shippingAddress.street[0]}
                    onChange={(e) => handleShippingAddressChange("street", [e.target.value, shippingAddress.street[1]])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Street address, P.O. box, company name"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <input
                    type="text"
                    id="street2"
                    name="street[1]"
                    value={shippingAddress.street[1]}
                    onChange={(e) => handleShippingAddressChange("street", [shippingAddress.street[0], e.target.value])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 mt-2"
                    placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                </div>
                
                <div>
                  <label htmlFor="country_id_shipping" className="block text-sm font-medium text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="country_id_shipping"
                    name="country_id"
                    value={shippingAddress.country_id}
                    onChange={(e) => {
                      handleShippingAddressChange("country_id", e.target.value);
                      handleCountryChange(e.target.value, "shipping");
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.full_name_english}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="region_shipping" className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province/Region <span className="text-red-500">*</span>
                  </label>
                  {regionsShipping.length === 0 ? (
                    <input
                      id="region_shipping_text"
                      type="text"
                      name="region"
                      value={shippingAddress.region}
                      onChange={(e) => {
                        handleShippingAddressChange("region", e.target.value);
                        handleShippingAddressChange("region_id", ""); // Clear region_id if text is used
                      }}
                      placeholder="Enter State/Province/Region"
                      required={!shippingAddress.country_id || (shippingAddress.country_id && regionsShipping.length === 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <select
                      id="region_id_shipping_select"
                      name="region_id"
                      value={shippingAddress.region_id}
                      onChange={(e) => {
                        const selectedRegionId = e.target.value;
                        const selectedRegion = regionsShipping.find((r) => Number(r.id) === Number(selectedRegionId));
                        handleShippingAddressChange("region_id", selectedRegionId);
                        handleShippingAddressChange("region", selectedRegion?.name || "");
                      }}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select State</option>
                      {regionsShipping.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingAddress.city}
                    onChange={(e) => handleShippingAddressChange("city", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-1">
                    Zip/Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text" // Changed to text for broader compatibility
                    id="postcode"
                    name="postcode"
                    value={shippingAddress.postcode}
                    onChange={(e) => handleShippingAddressChange("postcode", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={shippingAddress.telephone}
                    onChange={(e) => handleShippingAddressChange("telephone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email_shipping" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email_shipping"
                    name="email"
                    value={shippingAddress.email}
                    onChange={(e) => handleShippingAddressChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    readOnly={isAuthenticated() && currentUser?.email === shippingAddress.email} // Make email read-only if logged in and it's their main email
                  />
                </div>
              </div>
              {isAuthenticated() && (
                <div className="mt-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="save_in_address_book"
                      checked={shippingAddress.save_in_address_book !== false} // Default to true
                      onChange={(e) => handleShippingAddressChange("save_in_address_book", e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">Save in address book</span>
                  </label>
                </div>
              )}
            </>
          )}

          <div className="mt-6">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="same_as_billing"
                checked={shippingAddress.same_as_billing}
                onChange={toggleSameAsBilling}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Billing address same as shipping address</span>
            </label>
          </div>

          {!shippingAddress.same_as_billing && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Billing Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="billing_firstname" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="billing_firstname"
                    name="billing_firstname"
                    value={billingAddress.firstname}
                    onChange={(e) => handleBillingAddressChange("firstname", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="billing_lastname" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="billing_lastname"
                    name="billing_lastname"
                    value={billingAddress.lastname}
                    onChange={(e) => handleBillingAddressChange("lastname", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="billing_street1" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="billing_street1"
                    name="billing_street[0]"
                    value={billingAddress.street[0]}
                    onChange={(e) => handleBillingAddressChange("street", [e.target.value, billingAddress.street[1]])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <input
                    type="text"
                    id="billing_street2"
                    name="billing_street[1]"
                    value={billingAddress.street[1]}
                    onChange={(e) => handleBillingAddressChange("street", [billingAddress.street[0], e.target.value])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 mt-2"
                  />
                </div>
                <div>
                  <label htmlFor="billing_country_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="billing_country_id"
                    name="billing_country_id"
                    value={billingAddress.country_id}
                    onChange={(e) => {
                      handleBillingAddressChange("country_id", e.target.value);
                      handleCountryChange(e.target.value, "billing");
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.full_name_english}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="billing_region" className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province/Region <span className="text-red-500">*</span>
                  </label>
                  {regionsBilling.length === 0 ? (
                    <input
                      id="billing_region_text"
                      type="text"
                      name="billing_region"
                      value={billingAddress.region}
                      onChange={(e) => {
                        handleBillingAddressChange("region", e.target.value);
                        handleBillingAddressChange("region_id", "");
                      }}
                      placeholder="Enter State/Province/Region"
                      required={!billingAddress.country_id || (billingAddress.country_id && regionsBilling.length === 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <select
                      id="billing_region_id_select"
                      name="billing_region_id"
                      value={billingAddress.region_id}
                      onChange={(e) => {
                        const selectedRegionId = e.target.value;
                        const selectedRegion = regionsBilling.find((r) => Number(r.id) === Number(selectedRegionId));
                        handleBillingAddressChange("region_id", selectedRegionId);
                        handleBillingAddressChange("region", selectedRegion?.name || "");
                      }}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select State</option>
                      {regionsBilling.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label htmlFor="billing_city" className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="billing_city"
                    name="billing_city"
                    value={billingAddress.city}
                    onChange={(e) => handleBillingAddressChange("city", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="billing_postcode" className="block text-sm font-medium text-gray-700 mb-1">
                    Zip/Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="billing_postcode"
                    name="billing_postcode"
                    value={billingAddress.postcode}
                    onChange={(e) => handleBillingAddressChange("postcode", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="billing_telephone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="billing_telephone"
                    name="billing_telephone"
                    value={billingAddress.telephone}
                    onChange={(e) => handleBillingAddressChange("telephone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                 {/* Email for billing is usually not collected separately if "same as billing" is an option,
                 or if the primary email is already captured. Included for completeness if needed. */}
                <div>
                  <label htmlFor="billing_email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="billing_email"
                    name="billing_email"
                    value={billingAddress.email}
                    onChange={(e) => handleBillingAddressChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    readOnly={isAuthenticated() && currentUser?.email === billingAddress.email && shippingAddress.same_as_billing}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={saveShippingAddress}
              disabled={sectionLoading}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {sectionLoading ? "Saving..." : "Continue to Shipping"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AddressSection = memo(AddressSectionInternal);

export default AddressSection;
