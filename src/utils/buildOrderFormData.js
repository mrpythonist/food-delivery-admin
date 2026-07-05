// StoreOrderRequest expects a flat 'items[N][field]' shape when sent as multipart
// (required whenever a payment_receipt image is attached).
export function buildOrderFormData(payload) {
  const formData = new FormData();

  formData.append('customer_id', payload.customer_id);
  formData.append('address_id', payload.address_id);
  if (payload.coupon_code) formData.append('coupon_code', payload.coupon_code);
  formData.append('payment_method', payload.payment_method);
  if (payload.transaction_id) formData.append('transaction_id', payload.transaction_id);
  if (payload.payment_receipt) formData.append('payment_receipt', payload.payment_receipt);
  if (payload.notes) formData.append('notes', payload.notes);

  payload.items.forEach((item, idx) => {
    formData.append(`items[${idx}][product_id]`, item.product_id);
    formData.append(`items[${idx}][product_variant_id]`, item.product_variant_id);
    formData.append(`items[${idx}][quantity]`, item.quantity);
  });

  return formData;
}
