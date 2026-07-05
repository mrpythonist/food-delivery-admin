import { useCallback, useEffect, useState } from 'react';

export default function useOrders(params) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);

  const fetchOrders = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await getOrders(params);

      setOrders(data.data);
      setTotalRows(data.total);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    totalRows,
    loading,
    refresh: fetchOrders
  };
}
