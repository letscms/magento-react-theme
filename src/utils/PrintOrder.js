import { formatDate, formatPrice } from './formatters';

/**
 * Generates a print-friendly version of an order and opens the print dialog
 * @param {Object} order - The order object to print
 */
export const printOrder = (order) => {
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow pop-ups to print the order');
    return;
  }
  
  // Function to safely get shipping address
  const getShippingAddress = () => {
    if (!order.extension_attributes || 
        !order.extension_attributes.shipping_assignments || 
        !order.extension_attributes.shipping_assignments[0] || 
        !order.extension_attributes.shipping_assignments[0].shipping || 
        !order.extension_attributes.shipping_assignments[0].shipping.address) {
      return null;
    }
    
    return order.extension_attributes.shipping_assignments[0].shipping.address;
  };
  
  const shippingAddress = getShippingAddress();
  
  // Create print-friendly HTML content
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Order #${order.increment_id}</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 20px;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        h2 {
          font-size: 18px;
          margin-top: 20px;
          margin-bottom: 10px;
        }
        .order-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 5px;
        }
        .order-info div {
          flex: 1;
        }
        .address-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 20px;
        }
        .address-box {
          flex: 1;
          min-width: 250px;
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 15px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        .summary {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 5px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .summary-total {
          font-weight: bold;
          border-top: 1px solid #ddd;
          padding-top: 8px;
          margin-top: 8px;
        }
        .status-badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        }
        .status-complete { background-color: #d1fae5; color: #065f46; }
        .status-processing { background-color: #dbeafe; color: #1e40af; }
        .status-pending { background-color: #fef3c7; color: #92400e; }
        .status-canceled { background-color: #fee2e2; color: #b91c1c; }
        @media print {
          body { 
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <h1>Order #${order.increment_id}</h1>
      
      <div class="order-info">
        <div>
          <p style="color: #666; margin-bottom: 5px;">Order Date:</p>
          <p style="font-weight: 500; margin-top: 0;">${formatDate(order.created_at)}</p>
        </div>
        <div>
          <p style="color: #666; margin-bottom: 5px;">Status:</p>
          <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>
        </div>
        <div>
          <p style="color: #666; margin-bottom: 5px;">Total:</p>
          <p style="font-weight: 700; margin-top: 0;">${formatPrice(order.grand_total)}</p>
        </div>
      </div>
      
      <div class="address-container">
        ${shippingAddress ? `
        <div class="address-box">
          <h2>Shipping Address</h2>
          <p>
            ${shippingAddress.firstname} ${shippingAddress.lastname}<br>
            ${Array.isArray(shippingAddress.street) ? shippingAddress.street.join(', ') : shippingAddress.street}<br>
            ${shippingAddress.city}, ${shippingAddress.region} ${shippingAddress.postcode}<br>
            ${shippingAddress.country_id}<br>
            T: ${shippingAddress.telephone}
          </p>
        </div>
        ` : ''}
        
        <div class="address-box">
          <h2>Billing Address</h2>
          <p>
            ${order.billing_address.firstname} ${order.billing_address.lastname}<br>
            ${Array.isArray(order.billing_address.street) ? order.billing_address.street.join(', ') : order.billing_address.street}<br>
            ${order.billing_address.city}, ${order.billing_address.region} ${order.billing_address.postcode}<br>
            ${order.billing_address.country_id}<br>
            T: ${order.billing_address.telephone}
          </p>
        </div>
      </div>
      
      <div class="address-container">
        <div class="address-box">
          <h2>Payment Method</h2>
          <p>${order.payment.method}</p>
        </div>
        
        <div class="address-box">
          <h2>Shipping Method</h2>
          <p>${order.shipping_description}</p>
        </div>
      </div>
      
      <h2>Items Ordered</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td>
                <div style="font-weight: 500;">${item.name}</div>
                ${item.options ? item.options.map(option => `
                  <div style="font-size: 12px; color: #666; margin-top: 5px;">
                    <span style="font-weight: 500;">${option.label}:</span> ${option.value}
                  </div>
                `).join('') : ''}
              </td>
              <td>${item.sku}</td>
              <td>${formatPrice(item.price)}</td>
              <td>${item.qty_ordered}</td>
              <td style="font-weight: 500;">${formatPrice(item.row_total)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <h2>Order Summary</h2>
      <div class="summary">
        <div class="summary-row">
          <span>Subtotal</span>
          <span>${formatPrice(order.subtotal)}</span>
        </div>
        
        ${order.discount_amount > 0 ? `
        <div class="summary-row">
          <span>Discount</span>
          <span style="color: #059669;">-${formatPrice(Math.abs(order.discount_amount))}</span>
        </div>
        ` : ''}
        
        <div class="summary-row">
          <span>Shipping & Handling</span>
          <span>${formatPrice(order.shipping_amount)}</span>
        </div>
        
        ${order.tax_amount > 0 ? `
        <div class="summary-row">
          <span>Tax</span>
          <span>${formatPrice(order.tax_amount)}</span>
        </div>
        ` : ''}
        
        <div class="summary-row summary-total">
          <span>Grand Total</span>
          <span>${formatPrice(order.grand_total)}</span>
        </div>
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.open();
  printWindow.document.write(printContent);
  printWindow.document.close();
  
  // Wait for content to load before printing
  printWindow.onload = function() {
    printWindow.print();
    // Optional: Close the window after printing
    // printWindow.onafterprint = function() { printWindow.close(); };
  };
};

// Export other print-related functions if needed
export const printInvoice = (invoice) => {
  // Similar implementation for invoices

};

export const printShipment = (shipment) => { 
};
