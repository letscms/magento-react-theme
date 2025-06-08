import React, { useState } from 'react';
import { FaTruck, FaExchangeAlt, FaBoxOpen, FaCreditCard, FaGlobe, FaQuestionCircle } from 'react-icons/fa';

function ShippingReturns() {
  const [activeTab, setActiveTab] = useState('shipping');
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-10 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Shipping & Returns</h1>
        <p className="text-xl max-w-3xl">
          We want your shopping experience to be seamless from checkout to delivery and beyond.
          Learn about our shipping methods, delivery times, and hassle-free return policy.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap border-b border-gray-200 mb-8">
        <button
          className={`mr-8 py-4 text-lg font-medium border-b-2 transition-colors duration-300 ${
            activeTab === 'shipping' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('shipping')}
        >
          <div className="flex items-center">
            <FaTruck className="mr-2" />
            Shipping Information
          </div>
        </button>
        <button
          className={`mr-8 py-4 text-lg font-medium border-b-2 transition-colors duration-300 ${
            activeTab === 'returns' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('returns')}
        >
          <div className="flex items-center">
            <FaExchangeAlt className="mr-2" />
            Returns & Exchanges
          </div>
        </button>
        <button
          className={`py-4 text-lg font-medium border-b-2 transition-colors duration-300 ${
            activeTab === 'faq' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('faq')}
        >
          <div className="flex items-center">
            <FaQuestionCircle className="mr-2" />
            FAQ
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-12">
        {activeTab === 'shipping' && (
          <div className="animate-fadeIn">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FaTruck className="mr-3 text-blue-600" /> Shipping Methods
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-3">Standard Shipping</h3>
                  <p className="text-gray-600 mb-4">3-5 business days</p>
                  <p className="font-medium">
                    <span className="text-lg">$5.99</span>
                    <span className="text-gray-500 text-sm ml-1">Orders under $50</span>
                  </p>
                  <p className="font-medium text-green-600">FREE for orders over $50</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-3">Express Shipping</h3>
                  <p className="text-gray-600 mb-4">2 business days</p>
                  <p className="font-medium">
                    <span className="text-lg">$12.99</span>
                  </p>
                  <p className="text-sm text-gray-500">Order by 2 PM for same-day processing</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-3">Overnight Shipping</h3>
                  <p className="text-gray-600 mb-4">Next business day</p>
                  <p className="font-medium">
                    <span className="text-lg">$24.99</span>
                  </p>
                  <p className="text-sm text-gray-500">Order by 12 PM for same-day processing</p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FaGlobe className="mr-3 text-blue-600" /> International Shipping
              </h2>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <p className="mb-4">
                  We ship to over 100 countries worldwide. International shipping rates and delivery times vary by location.
                  Shipping costs will be calculated at checkout.
                </p>
                <p className="mb-4">
                  <strong>Estimated delivery times:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>Canada: 5-7 business days</li>
                  <li>Europe: 7-10 business days</li>
                  <li>Australia/New Zealand: 10-14 business days</li>
                  <li>Rest of World: 10-21 business days</li>
                </ul>
                <p className="text-sm text-gray-500">
                  Please note that international orders may be subject to import duties and taxes,
                  which are the responsibility of the customer.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FaBoxOpen className="mr-3 text-blue-600" /> Order Processing
              </h2>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <p className="mb-4">
                  Orders are processed within 1-2 business days after payment confirmation.
                  During sale events and holidays, processing times may be slightly longer.
                </p>
                <p className="mb-4">
                  You will receive a shipping confirmation email with tracking information once your order has been shipped.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-medium text-blue-800">
                    Need your order faster? Select Express or Overnight shipping at checkout and place your order before the cutoff times.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'returns' && (
          <div className="animate-fadeIn">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FaExchangeAlt className="mr-3 text-blue-600" /> Return Policy
              </h2>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <p className="mb-4">
                  We want you to be completely satisfied with your purchase. If you're not happy with your order for any reason,
                  we accept returns within 30 days of delivery for a full refund or exchange.
                </p>
                
                <h3 className="text-xl font-semibold mb-3 mt-6">Return Requirements</h3>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>Items must be unused, unworn, and in original condition</li>
                  <li>Original packaging must be intact</li>
                  <li>Proof of purchase is required (order number or receipt)</li>
                  <li>Sale items can only be returned for store credit</li>
                </ul>
                
                <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                  <p className="font-medium text-yellow-800">
                    Please note: Certain items like intimate apparel, swimwear, and personalized products cannot be returned for hygiene and customization reasons.
                  </p>
                </div>
                
                <h3 className="text-xl font-semibold mb-3">How to Initiate a Return</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Log in to your account and go to "Order History"</li>
                  <li>Select the order containing the item(s) you wish to return</li>
                  <li>Click "Return Items" and follow the instructions</li>
                  <li>Print the prepaid return shipping label</li>
                  <li>Package your items securely and attach the label</li>
                  <li>Drop off the package at your nearest shipping location</li>
                </ol>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FaCreditCard className="mr-3 text-blue-600" /> Refund Process
              </h2>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <p className="mb-4">
                  Once we receive and inspect your return, we'll process your refund. The money will be refunded to your original payment method.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Processing Time</h3>
                    <p>Refunds typically take 3-5 business days to process after we receive your return.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Credit Card Refunds</h3>
                    <p>Please allow an additional 2-5 business days for the refund to appear on your credit card statement.</p>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-medium text-green-800">
                    Want a faster option? You can choose to receive store credit instead of a refund to your original payment method.
                    Store credit is issued immediately upon approval of your return.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FaExchangeAlt className="mr-3 text-blue-600" /> Exchanges
              </h2>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <p className="mb-4">
                  Need a different size or color? We make exchanges easy. You can request an exchange through your account
                  or contact our customer service team for assistance.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Exchange Process</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Follow the same initial steps as a return</li>
                  <li>Select "Exchange" instead of "Return" when processing</li>
                  <li>Choose the new item, size, or color you'd like</li>
                  <li>If there's a price difference, we'll charge or refund accordingly</li>
                </ol>
                
                <p className="mt-4 text-sm text-gray-500">
                  Please note that exchanges are subject to product availability. If your desired item is out of stock,
                  we'll process a refund instead.
                </p>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="animate-fadeIn space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold mb-3">How can I track my order?</h3>
              <p>
                Once your order ships, you'll receive a shipping confirmation email with tracking information.
                You can also track your order by logging into your account and viewing your order history.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold mb-3">Do you ship to PO boxes?</h3>
              <p>
                Yes, we ship to PO boxes for Standard Shipping only. Express and Overnight shipping options require a physical address.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold mb-3">What if my package is damaged during shipping?</h3>
              <p>
                If your package arrives damaged, please take photos of the damaged packaging and products,
                and contact our customer service team within 48 hours of delivery. We'll arrange a replacement or refund.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold mb-3">Can I change my shipping address after placing an order?</h3>
              <p>
                We can only change the shipping address if the order hasn't been processed yet.
                Please contact our customer service team as soon as possible with your order number to request an address change.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold mb-3">Do I have to pay for return shipping?</h3>
              <p>
                For standard returns, we provide a prepaid return shipping label at no cost to you.
                However, for international returns, customers are responsible for return shipping costs.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold mb-3">How long do I have to return an item?</h3>
              <p>
                You have 30 days from the delivery date to return items. After this period, returns may be accepted for store credit only,
                at our discretion.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div className="mt-16 bg-gray-50 p-8 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
        <p className="mb-6">
          Our customer service team is here to help with any questions about shipping, returns, or exchanges.
        </p>
        <div className="flex flex-wrap gap-4">
          <a 
            href="/contact" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Us
          </a>
          <a 
            href="tel:1-800-123-4567" 
            className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Call 1-800-123-4567
          </a>
        </div>
      </div>
    </div>
  );
}

export default ShippingReturns;