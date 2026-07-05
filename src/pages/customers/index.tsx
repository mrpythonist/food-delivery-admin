import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import MainCard from 'components/MainCard';
import CustomersTable from 'sections/customers/CustomersTable';

export default function Customers() {
  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Stack spacing={0.5}>
          <Typography variant="h5">Customers</Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage your customer base
          </Typography>
        </Stack>
      </Grid>
      <Grid size={12}>
        <MainCard content={false} sx={{ p: 2.5 }}>
          <CustomersTable />
        </MainCard>
      </Grid>
    </Grid>
  );
}
