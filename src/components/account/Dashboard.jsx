import React, { useState, useEffect } from "react";
import { Link, useOutletContext, useNavigate } from "react-router-dom";
import { getRecentOrders } from "../../api/orders.js";
import { formatDate } from "../../utils/formatters";
import LoadingSpinner from "../../utils/Loader.jsx";

const Dashboard = () => {
  const { user } = useOutletContext();
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentOrders = async () => {
      setLoading(true);
      setError(null);

      try {  
        const result = await getRecentOrders(5);
   
        if (result && Array.isArray(result)) {
          setRecentOrders(result);    
        } else if (result && result.error) {
          console.error("Failed to fetch recent orders:", result.error);
          if (result.auth_error) {
            setError("Please refresh the page or navigate to another section.");
          } else {
            setError(result.error || "Unable to load recent orders");
          }
          setRecentOrders([]);
        } else {
          console.warn("Unexpected response structure from getRecentOrders:", result);
          setRecentOrders([]);
          setError("Unable to load recent orders. Unexpected data format.");
        }
      } catch (err) {
        console.error("Error fetching recent orders:", err);
        setError("Unable to load recent orders. Please try again later.");
        setRecentOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRecentOrders();
    } else {
      setLoading(false);
      setError("Please log in to view your recent orders.");
    }
  }, [user]);

  const renderAddress = (address) => {
    if (!address) return "No address available";

    const name = `${address.firstname || ""} ${address.lastname || ""}`.trim();
    const street = Array.isArray(address.street)
      ? address.street.join(", ")
      : address.street || "";
    const city = address.city || "";
    const region = address.region?.region || address.region || "";
    const postcode = address.postcode || "";
    const country = address.country_id || "";
    const phone = address.telephone || "";

    return (
      <>
        {name}
        <br />
        {street && (
          <>
            {street}
            <br />
          </>
        )}
        {city && region && postcode && (
          <>
            {city}, {region} {postcode}
            <br />
          </>
        )}
        {country && (
          <>
            {country}
            <br />
          </>
        )}
        {phone && <>T: {phone}</>}
      </>
    );
  };

  const getStatusStyle = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";

    const statusLower = status.toLowerCase();
    if (statusLower === "complete") return "bg-green-100 text-green-800";
    if (statusLower === "pending") return "bg-yellow-100 text-yellow-800";
    if (statusLower === "processing") return "bg-blue-100 text-blue-800";
    if (statusLower === "canceled" || statusLower === "cancelled")
      return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  if (!user) {
    return (
      <div className="text-center py-8 sm:py-10">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">My Account</h1>
        <p className="mb-4 sm:mb-6 text-sm sm:text-base">Please log in to view your account dashboard.</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-indigo-700 text-sm sm:text-base"
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">My Dashboard</h1>

      {/* Welcome Message */}
      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 sm:p-6 mb-4 sm:mb-6">
        <p className="text-indigo-700 text-sm sm:text-base">
          Hello,{" "}
          <span className="font-semibold">
            {user?.firstname || ""} {user?.lastname || ""}
          </span>
          ! From your account dashboard you can view your recent orders, manage
          your shipping and billing addresses, and edit your password and
          account details.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Account Information */}
        <div className="border rounded-lg p-4 sm:p-6">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold">Account Information</h2>
            <Link
              to="/account/edit"
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Edit
            </Link>
          </div>
          <div className="space-y-2 text-sm sm:text-base">
            <p>
              <span className="text-gray-600">Name:</span>{" "}
              {user?.firstname || ""} {user?.lastname || ""}
            </p>
            <p>
              <span className="text-gray-600">Email:</span> {user?.email || ""}
            </p>            
          </div>
        </div>

        {/* Default Addresses */}
        <div className="border rounded-lg p-4 sm:p-6">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold">Default Addresses</h2>
            <Link
              to="/account/addresses"
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Manage Addresses
            </Link>
          </div>

          {user?.addresses && user.addresses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-1 text-sm sm:text-base">
                  Default Billing
                </h3>
                <address className="text-xs sm:text-sm not-italic">
                  {renderAddress(
                    user.addresses.find((addr) => addr.default_billing) ||
                      user.addresses[0]
                  )}
                </address>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-1 text-sm sm:text-base">
                  Default Shipping
                </h3>
                <address className="text-xs sm:text-sm not-italic">
                  {renderAddress(
                    user.addresses.find((addr) => addr.default_shipping) ||
                      user.addresses[0]
                  )}
                </address>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm sm:text-base">
              You have not set a default billing or shipping address.
            </p>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="border rounded-lg p-4 sm:p-6">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold">Recent Orders</h2>
          <Link
            to="/account/orders"
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            View All Orders
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-6 sm:py-8">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 sm:p-6">
            <p className="text-red-700 text-sm sm:text-base">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
            >
              Refresh Page
            </button>
          </div>
        ) : recentOrders.length > 0 ? (
          <>
            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.entity_id || order.id || Math.random().toString()}
                  className="border rounded-lg p-4"
                >
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium text-gray-900">Order #</div>
                    <div>#{order.order_number || "N/A"}</div>
                    <div className="font-medium text-gray-900">Date</div>
                    <div>{order.created_at ? formatDate(order.created_at) : "N/A"}</div>
                    <div className="font-medium text-gray-900">Ship To</div>
                    <div>
                      {order.shipping_address
                        ? `${order.shipping_address.firstname || ""} ${order.shipping_address.lastname || ""}`.trim()
                        : "N/A"}
                    </div>
                    <div className="font-medium text-gray-900">Total</div>
                    <div>
                      ${typeof order.grand_total === "number"
                        ? order.grand_total.toFixed(2)
                        : "0.00"}
                    </div>
                    <div className="font-medium text-gray-900">Status</div>
                    <div>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status || "Unknown"}
                      </span>
                    </div>
                    <div className="font-medium text-gray-900">Actions</div>
                    <div>
                      <Link
                        to={`/account/orders/${order.entity_id || order.id}`}
                        className="text-indigo-600 hover:text-indigo-900 text-sm"
                      >
                        View Order
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Order #
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ship To
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr
                      key={order.entity_id || order.id || Math.random().toString()}
                    >
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.order_number || "N/A"}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.created_at ? formatDate(order.created_at) : "N/A"}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.shipping_address
                          ? `${order.shipping_address.firstname || ""} ${order.shipping_address.lastname || ""}`.trim()
                          : "N/A"}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${typeof order.grand_total === "number"
                          ? order.grand_total.toFixed(2)
                          : "0.00"}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {order.status || "Unknown"}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link
                          to={`/account/orders/${order.entity_id || order.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Order
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="bg-gray-50 p-4 sm:p-6 text-center rounded-lg">
            <p className="text-gray-500 text-sm sm:text-base">You have not placed any orders yet.</p>
            <Link
              to="/products"
              className="mt-2 sm:mt-3 inline-block text-indigo-600 hover:text-indigo-800 text-sm sm:text-base"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Dashboard);