import { useEffect, useState, useCallback } from 'react';
import { getCustomers } from 'api/customers';

export default function useCustomers(params) {
  const [customers, setCustomers] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getCustomers(params);
      setCustomers(data.data);
      setTotalRows(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return { customers, totalRows, loading, refresh: fetchCustomers };
}
