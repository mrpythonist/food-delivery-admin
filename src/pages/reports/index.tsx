import { useCallback, useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { getStats, getTopProducts, getSalesSummary, getOrdersByStatus } from 'api/reports';
import ReportsDateFilter from 'sections/reports/ReportsDateFilter';
import StatsSummaryCards from 'sections/reports/StatsSummaryCards';
import SalesSummaryCards from 'sections/reports/SalesSummaryCards';
import OrdersByStatusChart from 'sections/reports/OrdersByStatusChart';
import TopProductsCard from 'sections/reports/TopProductsCard';

export default function Reports() {
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [stats, setStats] = useState(null);
  const [salesSummary, setSalesSummary] = useState(null);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReports = useCallback(async (params) => {
    setLoading(true);
    try {
      const [statsRes, salesRes, statusRes, productsRes] = await Promise.all([
        getStats(params),
        getSalesSummary(params),
        getOrdersByStatus(params),
        getTopProducts(params)
      ]);
      setStats(statsRes.data);
      setSalesSummary(salesRes.data);
      setOrdersByStatus(statusRes.data);
      setTopProducts(productsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleApply({ from, to }) {
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    setDateRange({ from, to });
    loadReports(params);
  }

  function handleClear() {
    setDateRange({ from: '', to: '' });
    loadReports({});
  }

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Stack spacing={0.5}>
          <Typography variant="h5">Reports</Typography>
          <Typography variant="body2" color="text.secondary">
            Analyze order performance, sales, and top-selling products
          </Typography>
        </Stack>
      </Grid>

      <Grid size={12}>
        <ReportsDateFilter onApply={handleApply} onClear={handleClear} />
      </Grid>

      <Grid size={12}>
        <StatsSummaryCards stats={stats} loading={loading} />
      </Grid>

      <Grid size={12}>
        <SalesSummaryCards summary={salesSummary} loading={loading} />
      </Grid>

      <Grid size={{ xs: 12, lg: 5 }}>
        <OrdersByStatusChart data={ordersByStatus} loading={loading} />
      </Grid>

      <Grid size={{ xs: 12, lg: 7 }}>
        <TopProductsCard products={topProducts} loading={loading} />
      </Grid>
    </Grid>
  );
}
