import { useEffect, useState, useCallback } from 'react';
import { getAbandonedCarts } from 'api/carts';

export default function useAbandonedCarts(params) {
  const [carts, setCarts] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCarts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getAbandonedCarts(params);
      setCarts(data.data);
      setTotalRows(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchCarts();
  }, [fetchCarts]);

  return { carts, totalRows, loading, refresh: fetchCarts };
}
