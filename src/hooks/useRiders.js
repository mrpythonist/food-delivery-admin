import { useEffect, useState, useCallback } from 'react';
import { getRiders } from 'api/riders';

export default function useRiders(params) {
  const [riders, setRiders] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchRiders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getRiders(params);
      setRiders(data.data);
      setTotalRows(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchRiders();
  }, [fetchRiders]);

  return { riders, totalRows, loading, refresh: fetchRiders };
}
