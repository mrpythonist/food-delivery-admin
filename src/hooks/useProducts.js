import { useEffect, useState, useCallback } from 'react';
import { getProducts } from 'api/products';

export default function useProducts(params) {
  const [products, setProducts] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getProducts(params);
      setProducts(data.data);
      setTotalRows(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, totalRows, loading, refresh: fetchProducts };
}
