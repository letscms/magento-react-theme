import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getOrderById } from "../../api/orders";
import { formatDate, formatPrice } from "../../utils/formatters";
import { printOrder } from "../../utils/PrintOrder";

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
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
    };

    fetchOrderDetails();
  }, [orderId]);

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

  // Function to safely get shipping address
  const getShippingAddress = () => {
    if (
      !order.extension_attributes ||
      !order.extension_attributes.shipping_assignments ||
      !order.extension_attributes.shipping_assignments[0] ||
      !order.extension_attributes.shipping_assignments[0].shipping ||
      !order.extension_attributes.shipping_assignments[0].shipping.address
    ) {
      return null;
    }

    return order.extension_attributes.shipping_assignments[0].shipping.address;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 p-4 rounded-md text-red-800">{error}</div>;
  }

  if (!order) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md text-yellow-800">
        Order not found
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order #{order.order_number}</h1>
        <button
          onClick={() => navigate("/account/orders")}
          className="text-indigo-600 hover:text-indigo-800"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Orders
        </button>
      </div>

      {/* Order Status and Date */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-gray-50 p-4 rounded-lg">
        <div>
          <p className="text-gray-600 text-sm">Order Date:</p>
          <p className="font-medium">{formatDate(order.created_at)}</p>
        </div>
        <div className="mt-2 sm:mt-0">
          <p className="text-gray-600 text-sm">Status:</p>
          <span
            className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusClass(
              order.status
            )}`}
          >
            {order.status}
          </span>
        </div>
        <div className="mt-2 sm:mt-0">
          <p className="text-gray-600 text-sm">Total:</p>
          <p className="font-bold">{formatPrice(order.grand_total)}</p>
        </div>
      </div>

      {/* Order Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Shipping Address */}
        {getShippingAddress() && (
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
            <address className="not-italic">
              {getShippingAddress().firstname} {getShippingAddress().lastname}
              <br />
              {Array.isArray(getShippingAddress().street)
                ? getShippingAddress().street.join(", ")
                : getShippingAddress().street}
              <br />
              {getShippingAddress().city}, {getShippingAddress().region}{" "}
              {getShippingAddress().postcode}
              <br />
              {getShippingAddress().country_id}
              <br />
              T: {getShippingAddress().telephone}
            </address>
          </div>
        )}

        {/* Billing Address */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Billing Address</h2>
          <address className="not-italic">
            {order.billing_address.firstname} {order.billing_address.lastname}
            <br />
            {Array.isArray(order.billing_address.street)
              ? order.billing_address.street.join(", ")
              : order.billing_address.street}
            <br />
            {order.billing_address.city}, {order.billing_address.region}{" "}
            {order.billing_address.postcode}
            <br />
            {order.billing_address.country_id}
            <br />
            T: {order.billing_address.telephone}
          </address>
        </div>

        {/* Payment Method */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
          {order.payment_methods.length > 0 ? (
            <div>
              <p className="font-medium">{order.payment_methods[0].name}</p>
              {order.payment_methods[0].additional_data.length > 0 && (
                <div className="mt-2">
                  {order.payment_methods[0].additional_data.map(
                    (item, index) => (
                      <p key={index}>
                        {item.name}: {item.value}
                      </p>
                    )
                  )}
                </div>
              )}
            </div>
          ) : (
            <p>No payment method information available</p>
          )}
        </div>

        {/* Shipping Method */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Shipping Method</h2>
          <p>
            {order.shipping_method ||
              "No shipping method information available"}
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Items Ordered</h2>
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  SKU
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Qty
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item) => (
                <Link to={`/product/${item.product.url_key}`} className="no-underline" key={item.id}>
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded mr-3 flex items-center justify-center">
                        {/* Displaying product image */}
                        {item.product &&
                        item.product.small_image &&
                        item.product.small_image.url ? (
                          <img
                            src={item.product.small_image.url}
                            alt={
                              item.product.small_image.label ||
                              item.product.name
                            }
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <i className="fas fa-box text-gray-400"></i> // Fallback icon if no image
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {/* Access product name via item.product.name */}
                          {item.product.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {/* Access product SKU via item.product.sku */}
                          SKU: {item.product.sku}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* Access product SKU via item.product.sku */}
                    {item.product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* This remains correct as product_sale_price is directly on item */}
                    {formatPrice(item.product_sale_price.value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* This remains correct as quantity_ordered is directly on item */}
                    {item.quantity_ordered}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {formatPrice(
                      item.product_sale_price.value * item.quantity_ordered
                    )}
                  </td>
                </tr>
                </Link>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Summary */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-2">
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
              <span className="font-bold">
                {formatPrice(order.grand_total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        {order.status === "complete" && (
          <Link
            to={`/account/orders/${order.entity_id}/reorder`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <i className="fas fa-redo mr-2"></i>
            Reorder
          </Link>
        )}

        <button
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          onClick={() => printOrder(order)}
        >
          <i className="fas fa-print mr-2"></i>
          Print Order
        </button>

        {order.status !== "complete" && order.status !== "canceled" && (
          <Link
            to={`/account/orders/${order.entity_id}/track`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <i className="fas fa-truck mr-2"></i>
            Track Order
          </Link>
        )}
      </div>
    </div>
  );
};

export default React.memo(OrderDetail);
