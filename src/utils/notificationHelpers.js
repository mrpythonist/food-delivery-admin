export function getNotifiableName(notification) {
  const entity = notification.notifiable;
  if (!entity) return notification.notifiable_type?.includes('Rider') ? 'Rider' : 'Customer';

  if (notification.notifiable_type?.includes('Customer')) {
    return `${entity.first_name || ''} ${entity.last_name || ''}`.trim() || `Customer #${entity.id}`;
  }
  return entity.name || `Rider #${entity.id}`;
}

export function getNotifiableType(notification) {
  return notification.notifiable_type?.includes('Rider') ? 'rider' : 'customer';
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
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
