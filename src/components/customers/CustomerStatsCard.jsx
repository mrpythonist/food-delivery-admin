import { Box, Grid, Stack, Typography } from '@mui/material';
import ShoppingOutlined from '@ant-design/icons/ShoppingOutlined';
import DollarOutlined from '@ant-design/icons/DollarOutlined';
import HomeOutlined from '@ant-design/icons/HomeOutlined';
import MainCard from 'components/MainCard';

function money(v) {
  return `PKR ${Number(v || 0).toLocaleString()}`;
}

export default function CustomerStatsCard({ orders, addressCount }) {
  const orderCount = orders?.length || 0;
  const totalSpent = (orders || []).reduce((sum, o) => sum + Number(o.total || 0), 0);

  const stats = [
    { label: 'Total Orders', value: orderCount, icon: <ShoppingOutlined /> },
    { label: 'Total Spent', value: money(totalSpent), icon: <DollarOutlined /> },
    { label: 'Saved Addresses', value: addressCount, icon: <HomeOutlined /> }
  ];

  return (
    <MainCard title="Customer Stats">
      <Grid container spacing={2}>
        {stats.map((s) => (
          <Grid size={4} key={s.label}>
            <Stack spacing={0.5} alignItems="center" sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 1.5 }}>
              <Box color="primary.main">{s.icon}</Box>
              <Typography variant="h5">{s.value}</Typography>
              <Typography variant="caption" color="text.secondary" textAlign="center">
                {s.label}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </MainCard>
  );
}
