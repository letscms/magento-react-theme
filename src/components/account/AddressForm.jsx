import React, { useState, useEffect } from "react";
import {
  addAddress,
  updateAddress,
  fetchCountries,
  fetchRegionsByCountry,
} from "../../api/addressApi";

function AddressForm({ initialData = null, onSuccess, onCancel }) {
  const isEditing = !!initialData?.id; // Only consider editing if we have an ID
  const customerdata = localStorage.getItem("magentoUserInfo");
  const customer = customerdata ? JSON.parse(customerdata) : null;
  // Initialize form data once, not on every render
  const [formData, setFormData] = useState({
    id: initialData?.id || null, // Ensure ID is included if available
    customerId: customer?.id || null,
    firstname: "",
    lastname: "",
    email: customer?.email || "",
    street: ["", ""],
    city: "",
    region_input: "", // User input for region name
    region_id: "", // Region ID if available
    postcode: "",
    country_id: "US",
    telephone: "",
    default_billing: false,
    default_shipping: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formInitialized, setFormInitialized] = useState(false);
  const [countries, setCountries] = useState([]);
  const [region, setRegion] = useState([]);

  useEffect(() => {
    const fetchCountriesData = async () => {
      try {
        const response = await fetchCountries();
        if (response) {
          setCountries(response); // Set the fetched countries
        } else {
          console.error("Failed to fetch countries:", response.message);
          setCountries([]); // Set to empty array if fetching fails
        }
      } catch (err) {
        console.error("Error fetching countries:", err);
        setCountries([]); // Set to empty array on error
      }
    };
    fetchCountriesData();
  }, []);

  const changeCountry = async (e) => {
    const countryId = e.target.value;
    const region_id = await fetchRegionsByCountry(countryId);
    if (region_id) {
      setRegion(region_id); // Set the regions based on selected country
    } else {
      console.error("Failed to fetch regions for country:", countryId);
      setRegion([]); // Set to empty array if fetching fails
    }
  };

  // Only initialize form data once when component mounts or initialData changes
  useEffect(() => {
    if (initialData && !formInitialized) {
      // Format the data for the form
      setFormData({
        id: initialData.id || null, // Ensure ID is included
        customerId: initialData.customerId || customer?.id || null,
        firstname: initialData.firstname || "",
        lastname: initialData.lastname || "",
        email: initialData.email || (customer ? customer.email : ""), // Use customer email as fallback
        // Handle street which could be string or array
        street: Array.isArray(initialData.street)
          ? [
              ...initialData.street,
              ...Array(Math.max(0, 2 - initialData.street.length)).fill(""),
            ].slice(0, 2)
          : [initialData.street || "", ""],
        city: initialData.city || "",
        // Handle region which could be string or object
        region_input:
          typeof initialData.region === "object"
            ? initialData.region.region || ""
            : initialData.region || "",
        region_id:
          typeof initialData.region === "object"
            ? initialData.region.region_id || ""
            : initialData.region_id || "",
        postcode: initialData.postcode || "",
        country_id: initialData.country_id || "US",
        telephone: initialData.telephone || "",
        default_billing: initialData.default_billing || false,
        default_shipping: initialData.default_shipping || false,
      });
      setFormInitialized(true);
    }
  }, [initialData, customer, formInitialized]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setError(null); // Clear error on change

    if (name.startsWith("street[")) {
      const index = parseInt(name.match(/\[(\d+)\]/)[1], 10);
      const newStreet = [...formData.street];
      newStreet[index] = value;
      setFormData((prev) => ({ ...prev, street: newStreet }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Ensure email is included
      if (!formData.email) {
        throw new Error("Customer email is required");
      }

      // Prepare data for submission
      const dataToSubmit = {
        ...formData,
        // Filter out empty street lines
        street: formData.street.filter((line) => line && line.trim() !== ""),
        // Set region as an object for Magento
        region: {
          region: formData.region_input,
          region_id: formData.region_id
            ? parseInt(formData.region_id, 10)
            : null,
        },
      };

      // Remove temporary fields
      delete dataToSubmit.region_input;

      if (isEditing && dataToSubmit.id) {
        await updateAddress(dataToSubmit);
      } else {
        // For new addresses, we don't need an ID
        delete dataToSubmit.id;
        await addAddress(dataToSubmit);
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error saving address:", err);
      setError(err.message || "Failed to save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-medium mb-4">
        {isEditing ? "Edit Address" : "Add New Address"}
      </h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          {/* Include ID as hidden field if editing */}
          {isEditing && (
            <input
              type="hidden"
              name="id"
              id="id"
              value={formData.id || ""}
              readOnly
            />
          )}

          <input
            type="hidden"
            name="customerId"
            id="customerId"
            value={formData.customerId || ""}
            readOnly
          />

          {/* Hidden email field to ensure it's included in the submission */}
          <input
            type="hidden"
            name="email"
            id="email"
            value={formData.email || ""}
            readOnly
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="firstname"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name*
            </label>
            <input
              id="firstname"
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="lastname"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name*
            </label>
            <input
              id="lastname"
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Address*
          </label>
          <input
            type="text"
            name="street[0]"
            value={formData.street[0]}
            onChange={handleChange}
            placeholder="Street Address Line 1"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
          />
          <input
            type="text"
            name="street[1]"
            value={formData.street[1]}
            onChange={handleChange}
            placeholder="Street Address Line 2 (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="country_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Country*
            </label>
            <select
              id="country_id"
              name="country_id"
              value={formData.country_id}
              onChange={(e) => {
                handleChange(e);
                changeCountry(e);
              }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.full_name_english || country.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="region_input"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              State/Province/Region*
            </label>
            {region.length === 0 && (
              <input
                id="region_input"
                type="text"
                name="region_input"
                value={formData.region_input}
                onChange={handleChange}
                placeholder="Enter State/Province/Region"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
            {region.length > 0 && (
               <select
              id="region_id"
              name="region_id"
              value={formData.region_id}
              onChange={(e) => {
                handleChange(e);                
              }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Country</option>
              {region.map((region_id) => (
                <option key={region_id.id} value={region_id.id}>
                  {region_id.full_name_english || region_id.name}
                </option>
              ))}
            </select>
            )}
           
          </div>
          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              City*
            </label>
            <input
              id="city"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="postcode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Zip/Postal Code*
            </label>
            <input
              id="postcode"
              type="text"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="telephone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number*
          </label>
          <input
            id="telephone"
            type="number"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="default_shipping"
              name="default_shipping"
              checked={formData.default_shipping}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="default_shipping"
              className="ml-2 block text-sm text-gray-700"
            >
              Use as default shipping address
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="default_billing"
              name="default_billing"
              checked={formData.default_billing}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="default_billing"
              className="ml-2 block text-sm text-gray-700"
            >
              Use as default billing address
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading
              ? "Saving..."
              : isEditing
              ? "Update Address"
              : "Add Address"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default React.memo(AddressForm);
