export function isExpired(coupon) {
  if (!coupon.expires_at) return false;
  return new Date(coupon.expires_at) < new Date();
}

export function formatValue(coupon) {
  return coupon.type === 'percentage' ? `${Number(coupon.value)}%` : `PKR ${Number(coupon.value).toLocaleString()}`;
}

export function formatMinOrder(value) {
  if (!value) return 'No minimum';
  return `PKR ${Number(value).toLocaleString()}+`;
}
