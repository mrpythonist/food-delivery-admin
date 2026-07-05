import { money, formatDate } from './orderStatus';

export function printInvoice(order) {
  const itemsRows = order.items
    .map(
      (item) => `
        <tr>
          <td>${item.product_name}</td>
          <td>${item.variant_name || '-'}</td>
          <td style="text-align:center">${item.quantity}</td>
          <td style="text-align:right">${money(item.unit_price)}</td>
          <td style="text-align:right">${money(item.total_price)}</td>
        </tr>`
    )
    .join('');

  const html = `
    <html>
      <head>
        <title>Invoice ${order.order_number}</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; padding: 40px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1a1a1a; padding-bottom: 16px; margin-bottom: 24px; }
          .header h1 { margin: 0; font-size: 22px; }
          .header p { margin: 4px 0 0; color: #666; font-size: 13px; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: capitalize; background: #f0f0f0; margin-left: 6px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
          .box { border: 1px solid #e0e0e0; border-radius: 8px; padding: 14px 16px; }
          .box h3 { margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #888; }
          .box p { margin: 3px 0; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th { text-align: left; font-size: 12px; text-transform: uppercase; color: #888; border-bottom: 2px solid #e0e0e0; padding: 8px 6px; }
          td { padding: 10px 6px; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
          .totals { width: 280px; margin-left: auto; margin-top: 16px; }
          .totals div { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; }
          .totals .grand { border-top: 2px solid #1a1a1a; margin-top: 8px; padding-top: 10px; font-size: 17px; font-weight: 700; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>Invoice</h1>
            <p>Order #${order.order_number}</p>
            <p>${formatDate(order.placed_at)}</p>
          </div>
          <div style="text-align:right">
            <strong>${order.customer?.first_name || ''} ${order.customer?.last_name || ''}</strong>
            <p>${order.customer?.phone || '-'}</p>
            <p>${order.address?.address_line_1 || ''} ${order.address?.address_line_2 || ''} ${order.address?.city || ''}, ${order.address?.state || ''} ${order.address?.postal_code || ''}</p>
          </div>
        </div>
        <table>
          <thead>
            <tr><th>Product</th><th>Variant</th><th style="text-align:center">Qty</th><th style="text-align:right">Unit Price</th><th style="text-align:right">Total</th></tr>
          </thead>
          <tbody>${itemsRows}</tbody>
        </table>

        <div class="totals">
          <div><span>Subtotal</span><span>${money(order.subtotal)}</span></div>
          <div><span>Delivery Fee</span><span>${money(order.delivery_fee)}</span></div>
          <div><span>Discount</span><span>-${money(order.discount)}</span></div>
          <div class="grand"><span>Grand Total</span><span>${money(order.total)}</span></div>
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank', 'width=800,height=900');
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}
