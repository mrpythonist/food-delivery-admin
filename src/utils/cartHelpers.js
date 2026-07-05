export function money(value) {
  return `PKR ${Number(value || 0).toLocaleString()}`;
}

export function cartSubtotal(cart) {
  return (cart.items || []).reduce((sum, item) => sum + Number(item.total_price || 0), 0);
}

export function cartItemCount(cart) {
  return (cart.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}

export function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
