import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import MainCard from 'components/MainCard';
import AbandonedCartsTable from 'sections/carts/AbandonedCartsTable';

export default function AbandonedCarts() {
  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Stack spacing={0.5}>
          <Typography variant="h5">Abandoned Carts</Typography>
          <Typography variant="body2" color="text.secondary">
            Customers with items sitting in their cart for 24+ hours
          </Typography>
        </Stack>
      </Grid>
      <Grid size={12}>
        <MainCard content={false} sx={{ p: 2.5 }}>
          <AbandonedCartsTable />
        </MainCard>
      </Grid>
    </Grid>
  );
}
