import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getOrderById } from "../../api/orders";
import { formatDate, formatPrice } from "../../utils/formatters";
import { printOrder } from "../../utils/PrintOrder";

// Static mapping for bundle option value IDs to labels (based on 24-WG080)
const BUNDLE_OPTION_LABELS = {
  "MTg=": "Sprite Stasis Ball 55 cm",
  "MTk=": "Sprite Foam Yoga Brick",
  "MjA=": "Sprite Yoga Strap",
  "MjE=": "Sprite Foam Roller"
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simple debounce implementation
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Fetch order details with debouncing
  const fetchOrderDetails = useCallback(
    debounce(async () => {
      setLoading(true);
      try {
        const orderData = await getOrderById(orderId);
        if (orderData) {
          setOrder(orderData);
          setError(null);
        } else {
          setError("Order not found");
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    }, 300),
    [orderId]
  );

  useEffect(() => {
    fetchOrderDetails();
    return () => clearTimeout(fetchOrderDetails); // Cleanup debounce
  }, [fetchOrderDetails]);

  const getStatusClass = useCallback((status) => {
    switch (status?.toLowerCase()) {
      case "complete":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-indigo-100 text-indigo-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, []);
console.log("order", order);
  // Safely get shipping address
  const getShippingAddress = useCallback(() => {
    return order?.shipping_address || null;
  }, [order]);

  // Render bundle or grouped product details
  const renderProductDetails = (item) => {
    if (item.product_type === "bundle" && item.bundle_options?.length > 0) {
      return (
        <div className="ml-4 mt-2 text-xs text-gray-600">
          <ul className="list-disc pl-4">
            {item.bundle_options.map((option) => (
              <li key={option.id}>
                {option.label}:{" "}
                {option.values.map((value) => (
                  <span key={value.id}>
                    {BUNDLE_OPTION_LABELS[value.id] || `Option ${value.id}`} (x{value.quantity}, {formatPrice(value.price.value)})
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    // Placeholder for grouped products (if any)
    if (item.product_type === "grouped" && item.grouped_items?.length > 0) {
      return (
        <div className="ml-4 mt-2 text-xs text-gray-600">
          <ul className="list-disc pl-4">
            {item.grouped_items.map((child) => (
              <li key={child.id}>
                {child.product.name} (SKU: {child.product.sku}, x{child.quantity_ordered}, {formatPrice(child.product_sale_price.value)})
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md fade-in" role="alert">
        {error}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-md fade-in" role="alert">
        Order not found
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
      <style>
        {`
          .fade-in {
            animation: fadeIn 0.3s ease-in;
          }
          .section:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Order #{order.order_number}
          </h1>
          <button
            onClick={() => navigate("/account/orders")}
            className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center transition-colors"
            aria-label="Back to orders"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Orders
          </button>
        </div>

        {/* Order Status and Date */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-gray-50 p-4 rounded-lg section transition-shadow">
          <div className="mb-2 sm:mb-0">
            <p className="text-gray-600 text-sm">Order Date:</p>
            <p className="font-medium">{formatDate(order.created_at)}</p>
          </div>
          <div className="mb-2 sm:mb-0">
            <p className="text-gray-600 text-sm">Status:</p>
            <span
              className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusClass(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total:</p>
            <p className="font-bold">{formatPrice(order.grand_total)}</p>
          </div>
        </div>

        {/* Order Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {/* Shipping Address */}
          {getShippingAddress() && (
            <div className="border rounded-lg p-4 bg-white section transition-shadow">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">Shipping Address</h2>
              <address className="not-italic text-sm text-gray-600">
                {getShippingAddress().firstname} {getShippingAddress().lastname}
                <br />
                {Array.isArray(getShippingAddress().street)
                  ? getShippingAddress().street.join(", ")
                  : getShippingAddress().street}
                <br />
                {getShippingAddress().city}, {getShippingAddress().region}{" "}
                {getShippingAddress().postcode}
                <br />
                {getShippingAddress().country_code}
                <br />
                T: {getShippingAddress().telephone}
              </address>
            </div>
          )}

          {/* Billing Address */}
          <div className="border rounded-lg p-4 bg-white section transition-shadow">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Billing Address</h2>
            <address className="not-italic text-sm text-gray-600">
              {order.billing_address.firstname} {order.billing_address.lastname}
              <br />
              {Array.isArray(order.billing_address.street)
                ? order.billing_address.street.join(", ")
                : order.billing_address.street}
              <br />
              {order.billing_address.city}, {order.billing_address.region}{" "}
              {order.billing_address.postcode}
              <br />
              {order.billing_address.country_code}
              <br />
              T: {order.billing_address.telephone}
            </address>
          </div>

          {/* Payment Method */}
          <div className="border rounded-lg p-4 bg-white section transition-shadow">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Payment Method</h2>
            {order.payment_methods?.length > 0 ? (
              <div className="text-sm text-gray-600">
                <p className="font-medium">{order.payment_methods[0].name}</p>
                {order.payment_methods[0].additional_data?.length > 0 && (
                  <div className="mt-2">
                    {order.payment_methods[0].additional_data.map((item, index) => (
                      <p key={index}>
                        {item.name}: {item.value}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No payment method information available</p>
            )}
          </div>

          {/* Shipping Method */}
          <div className="border rounded-lg p-4 bg-white section transition-shadow">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Shipping Method</h2>
            <p className="text-sm text-gray-600">
              {order.shipping_method || "No shipping method information available"}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Items Ordered</h2>
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    SKU
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Qty
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors fade-in">
                    <td className="px-4 sm:px-6 py-4">
                      <Link
                        to={`/product/${item.product.url_key}`}
                        className="no-underline"
                        aria-label={`View ${item.product.name}`}
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-200 rounded mr-3 flex items-center justify-center">
                            {item.product?.small_image?.url ? (
                              <img
                                src={item.product.small_image.url}
                                alt={item.product.small_image.label || item.product.name}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <i className="fas fa-box text-gray-400"></i>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.product.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              SKU: {item.product.sku}
                            </div>
                            {renderProductDetails(item)}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.product.sku}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPrice(item.product_sale_price.value)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity_ordered}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatPrice(item.product_sale_price.value * item.quantity_ordered)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Order Summary</h2>
          <div className="bg-gray-50 p-4 rounded-lg section transition-shadow">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(order.total?.subtotal?.value)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping & Handling</span>
                <span>{formatPrice(order.total?.total_shipping?.value)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>{formatPrice(order.total?.total_tax?.value)}</span>
              </div>
              {order.total?.discounts?.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600">
                    -{formatPrice(order.total.discounts[0].amount.value)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-semibold">Grand Total</span>
                <span className="font-bold">{formatPrice(order.grand_total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          {order.status === "complete" && (
            <Link
              to={`/account/orders/${order.id}/reorder`}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm transition-colors"
              aria-label="Reorder this order"
            >
              <i className="fas fa-redo mr-2"></i>
              Reorder
            </Link>
          )}
          <button
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => printOrder(order)}
            aria-label="Print order"
          >
            <i className="fas fa-print mr-2"></i>
            Print Order
          </button>
          {order.status !== "complete" && order.status !== "canceled" && (
            <Link
              to={`/account/orders/${order.id}/track`}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              aria-label="Track order"
            >
              <i className="fas fa-truck mr-2"></i>
              Track Order
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(OrderDetail);