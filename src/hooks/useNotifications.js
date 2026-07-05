import { useEffect, useState, useCallback } from 'react';
import { getNotifications, getUnreadNotificationCount } from 'api/notifications';

export default function useNotifications(params, { pollInterval } = {}) {
  const [notifications, setNotifications] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await getNotifications(params);
      setNotifications(data.data);
      setTotalRows(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const { data } = await getUnreadNotificationCount();
      setUnreadCount(data.unread_count);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  useEffect(() => {
    if (!pollInterval) return undefined;
    const timer = setInterval(fetchUnreadCount, pollInterval);
    return () => clearInterval(timer);
  }, [pollInterval, fetchUnreadCount]);

  return {
    notifications,
    totalRows,
    unreadCount,
    loading,
    refresh: fetchNotifications,
    refreshUnreadCount: fetchUnreadCount
  };
}
