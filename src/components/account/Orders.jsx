import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllOrders } from "../../api/orders.js";
import { formatDate, formatPrice } from "../../utils/formatters";
import LoadingSpinner from "../../utils/Loader.jsx";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const result = await getAllOrders(
          currentPage,
          ordersPerPage,
          filter !== "all" ? filter : null
        );
        if (result && result.items) {
          setOrders(result.items);
          setFilteredOrders(result.items);
          setTotalPages(Math.ceil(result.total_count / ordersPerPage));
          setError(null);
        } else if (result && result.error) {
          console.error("Failed to fetch orders:", result.error);
          setError(result.error || "Unable to load orders. Please try again later.");
          setOrders([]);
          setFilteredOrders([]);
          setTotalPages(1);
        } else {
          console.error("Unexpected response structure from getAllOrders:", result);
          setError("Unable to load orders due to an unexpected response. Please try again later.");
          setOrders([]);
          setFilteredOrders([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Network or unexpected error fetching orders:", err);
        setError("Unable to load orders due to a network or unexpected issue. Please try again later.");
        setOrders([]);
        setFilteredOrders([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage, filter]);

  useEffect(() => {
    // Client-side search filtering
    const filtered = orders.filter((order) =>
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping_address?.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping_address?.lastname?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOrders(filtered);
    setTotalPages(Math.ceil(filtered.length / ordersPerPage));
    setCurrentPage(1); // Reset to first page on search
  }, [searchQuery, orders]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "complete":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Paginate filtered orders
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">My Orders</h1>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
        <div className="w-full sm:w-auto">
          <label htmlFor="filter" className="mr-2 text-gray-700 text-sm sm:text-base">
            Filter by:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={handleFilterChange}
            className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
          >
            <option value="all">All Orders</option>
            <option value="processing">Processing</option>
            <option value="complete">Complete</option>
            <option value="pending">Pending</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fas fa-search text-gray-400 text-sm"></i>
          </div>
        </div>
      </div>

      {/* Orders Display */}
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
            Try Again
          </button>
        </div>
      ) : paginatedOrders.length > 0 ? (
        <>
          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {paginatedOrders
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((order) => (
                <div key={order.id} className="border rounded-lg p-4 shadow-sm bg-white">
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
                    <div>{formatPrice(order.grand_total)}</div>
                    <div className="font-medium text-gray-900">Status</div>
                    <div>
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status || "Unknown"}
                      </span>
                    </div>
                    <div className="font-medium text-gray-900">Actions</div>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/account/orders/${order.order_number}`}
                        className="text-indigo-600 hover:text-indigo-900 text-sm"
                      >
                        View
                      </Link>
                      {order.status === "complete" && (
                        <Link
                          to={`/account/orders/${order.id}/reorder`}
                          className="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          Reorder
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto shadow rounded-lg">
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
                {paginatedOrders
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
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
                        {formatPrice(order.grand_total)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status || "Unknown"}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/account/orders/${order.order_number}`}
                          className="text-indigo-600 hover:text-indigo-900 mr-3 sm:mr-4"
                        >
                          View
                        </Link>
                        {order.status === "complete" && (
                          <Link
                            to={`/account/orders/${order.id}/reorder`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Reorder
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 sm:mt-6">
              <nav
                className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px gap-1 sm:gap-2"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className={`relative inline-flex items-center px-3 sm:px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1 || loading
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <i className="fas fa-chevron-left"></i>
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        disabled={loading}
                        className={`relative inline-flex items-center px-3 sm:px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === i + 1
                            ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                            : "text-gray-500 hover:bg-gray-50"
                        } ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                      >
                        {i + 1}
                      </button>
                    );
                  } else if (
                    (pageNum === currentPage - 2 && currentPage > 3) ||
                    (pageNum === currentPage + 2 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <span key={i} className="px-2 py-2 text-sm">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className={`relative inline-flex items-center px-3 sm:px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages || loading
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <i className="fas fa-chevron-right"></i>
                </button>
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 sm:p-8 text-center">
          <div className="text-gray-500 mb-3 sm:mb-4">
            <i className="fas fa-shopping-bag text-3xl sm:text-4xl"></i>
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">
            No Orders Found
          </h3>
          <p className="text-gray-500 text-sm sm:text-base mb-3 sm:mb-4">
            {searchQuery ? "No orders match your search." : "You haven't placed any orders yet."}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-4 sm:px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default React.memo(Orders);