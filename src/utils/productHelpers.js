export function money(value) {
  return `PKR ${Number(value || 0).toLocaleString()}`;
}

export function priceRange(variants) {
  if (!variants || variants.length === 0) return '-';
  const prices = variants.map((v) => Number(v.price));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? money(min) : `${money(min)} - ${money(max)}`;
}
