export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'confirmed', label: 'Confirmed', color: 'info' },
  { value: 'preparing', label: 'Preparing', color: 'secondary' },
  { value: 'ready_for_pickup', label: 'Ready for Pickup', color: 'secondary' },
  { value: 'picked_up', label: 'Picked Up', color: 'primary' },
  { value: 'on_the_way', label: 'On the Way', color: 'primary' },
  { value: 'delivered', label: 'Delivered', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'error' }
];

export const PAYMENT_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'paid', label: 'Paid', color: 'success' },
  { value: 'failed', label: 'Failed', color: 'error' }
];

export function statusColor(status) {
  return ORDER_STATUSES.find((s) => s.value === status)?.color || 'default';
}

export function statusLabel(status) {
  return ORDER_STATUSES.find((s) => s.value === status)?.label || status?.replaceAll('_', ' ');
}

export function paymentColor(status) {
  return PAYMENT_STATUSES.find((s) => s.value === status)?.color || 'default';
}

export function paymentLabel(status) {
  return PAYMENT_STATUSES.find((s) => s.value === status)?.label || status;
}

export function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString();
}

export function money(value) {
  return `PKR ${Number(value || 0).toLocaleString()}`;
}
