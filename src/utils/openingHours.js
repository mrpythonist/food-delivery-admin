export const DAYS = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' },
  { key: 'sun', label: 'Sunday' }
];

const DEFAULT_HOURS = { open: '09:00', close: '23:00', closed: false };

export function parseOpeningHours(value) {
  const fallback = {};
  DAYS.forEach((d) => {
    fallback[d.key] = { ...DEFAULT_HOURS };
  });

  if (!value) return fallback;

  try {
    const parsed = JSON.parse(value);
    DAYS.forEach((d) => {
      if (parsed[d.key]) {
        fallback[d.key] = {
          open: parsed[d.key].open || DEFAULT_HOURS.open,
          close: parsed[d.key].close || DEFAULT_HOURS.close,
          closed: Boolean(parsed[d.key].closed)
        };
      }
    });
  } catch (err) {
    console.error('Failed to parse opening_hours, using defaults:', err);
  }

  return fallback;
}

export function serializeOpeningHours(hoursByDay) {
  return JSON.stringify(hoursByDay);
}
