import { Grid, Skeleton, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';

function money(v) {
  return `PKR ${Number(v || 0).toLocaleString()}`;
}

export default function SalesSummaryCards({ summary, loading }) {
  const cards = [
    { label: 'Total Sales (Delivered)', value: money(summary?.total_sales) },
    { label: 'Delivered Orders', value: summary?.total_orders ?? 0 },
    { label: 'Average Order Value', value: money(summary?.average_order) }
  ];

  return (
    <MainCard title="Sales Summary">
      <Grid container spacing={2}>
        {cards.map((c) => (
          <Grid size={4} key={c.label}>
            <Stack spacing={0.5} style={{ alignItems: 'center' }} sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 1.5 }}>
              {loading ? (
                <Skeleton width={80} height={32} />
              ) : (
                <Typography variant="h5" color="primary.main">
                  {c.value}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary" style={{ textAlign: 'center' }}>
                {c.label}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </MainCard>
  );
}
