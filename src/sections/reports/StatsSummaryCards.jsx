import { Grid, Skeleton, Stack, Typography } from '@mui/material';
import ShoppingCartOutlined from '@ant-design/icons/ShoppingCartOutlined';
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import CarOutlined from '@ant-design/icons/CarOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import TeamOutlined from '@ant-design/icons/TeamOutlined';
import DollarOutlined from '@ant-design/icons/DollarOutlined';
import MainCard from 'components/MainCard';

function money(v) {
  return `PKR ${Number(v || 0).toLocaleString()}`;
}

export default function StatsSummaryCards({ stats, loading }) {
  const cards = [
    { label: 'Total Orders', value: stats?.total_orders, icon: <ShoppingCartOutlined />, color: 'primary.main' },
    { label: 'Pending', value: stats?.pending_orders, icon: <ClockCircleOutlined />, color: 'warning.main' },
    { label: 'Confirmed', value: stats?.confirmed_orders, icon: <CheckCircleOutlined />, color: 'info.main' },
    { label: 'Delivered', value: stats?.delivered_orders, icon: <CarOutlined />, color: 'success.main' },
    { label: 'Cancelled', value: stats?.cancelled_orders, icon: <CloseCircleOutlined />, color: 'error.main' },
    { label: 'Customers', value: stats?.customers, icon: <TeamOutlined />, color: 'secondary.main' },
    { label: 'Revenue (Delivered)', value: money(stats?.revenue), icon: <DollarOutlined />, color: 'primary.main' }
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((c) => (
        <Grid size={{ xs: 6, sm: 4, md: 12 / 7 }} key={c.label}>
          <MainCard>
            <Stack spacing={1}>
              <Stack direction="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  {c.label}
                </Typography>
                <Stack sx={{ color: c.color }}>{c.icon}</Stack>
              </Stack>
              {loading ? <Skeleton width={60} height={32} /> : <Typography variant="h5">{c.value ?? 0}</Typography>}
            </Stack>
          </MainCard>
        </Grid>
      ))}
    </Grid>
  );
}
