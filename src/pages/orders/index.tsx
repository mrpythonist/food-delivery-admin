import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import MainCard from 'components/MainCard';
import OrdersTable from 'sections/orders/OrdersTable';

export default function Orders() {
  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Stack spacing={0.5}>
          <Typography variant="h5">Orders</Typography>
          <Typography variant="body2" color="text.secondary">
            Search, filter, and manage customer orders across your platform
          </Typography>
        </Stack>
      </Grid>
      <Grid size={12}>
        <MainCard content={false} sx={{ p: 2.5 }}>
          <OrdersTable />
        </MainCard>
      </Grid>
    </Grid>
  );
}
