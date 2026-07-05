import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import MainCard from 'components/MainCard';
import RidersTable from 'sections/riders/RidersTable';

export default function Riders() {
  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Stack spacing={0.5}>
          <Typography variant="h5">Riders</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage delivery riders and track their availability
          </Typography>
        </Stack>
      </Grid>
      <Grid size={12}>
        <MainCard content={false} sx={{ p: 2.5 }}>
          <RidersTable />
        </MainCard>
      </Grid>
    </Grid>
  );
}
