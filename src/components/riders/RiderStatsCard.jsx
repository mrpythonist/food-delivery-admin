import { Grid, Stack, Typography, Box } from '@mui/material';
import CarOutlined from '@ant-design/icons/CarOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import SyncOutlined from '@ant-design/icons/SyncOutlined';
import MainCard from 'components/MainCard';

export default function RiderStatsCard({ orders }) {
  const totalOrders = orders?.length || 0;
  const delivered = (orders || []).filter((o) => o.status === 'delivered').length;
  const active = (orders || []).filter((o) => !['delivered', 'cancelled'].includes(o.status)).length;

  const stats = [
    { label: 'Total Assigned', value: totalOrders, icon: <CarOutlined /> },
    { label: 'Delivered', value: delivered, icon: <CheckCircleOutlined /> },
    { label: 'Active Orders', value: active, icon: <SyncOutlined /> }
  ];

  return (
    <MainCard title="Rider Stats">
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
