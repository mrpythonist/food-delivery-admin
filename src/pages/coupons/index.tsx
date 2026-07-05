import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import MainCard from 'components/MainCard';
import CouponsTable from 'sections/coupons/CouponsTable';

export default function Coupons() {
  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Stack spacing={0.5}>
          <Typography variant="h5">Coupons</Typography>
          <Typography variant="body2" color="text.secondary">
            Create and manage discount coupons for your store
          </Typography>
        </Stack>
      </Grid>
      <Grid size={12}>
        <MainCard content={false} sx={{ p: 2.5 }}>
          <CouponsTable />
        </MainCard>
      </Grid>
    </Grid>
  );
}
