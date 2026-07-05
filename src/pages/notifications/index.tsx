import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import MainCard from 'components/MainCard';
import NotificationsList from 'sections/notifications/NotificationsList';

export default function Notifications() {
  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Stack spacing={0.5}>
          <Typography variant="h5">Notifications</Typography>
          <Typography variant="body2" color="text.secondary">
            Activity across all customers and riders
          </Typography>
        </Stack>
      </Grid>
      <Grid size={12}>
        <MainCard content={false} sx={{ p: 2.5 }}>
          <NotificationsList />
        </MainCard>
      </Grid>
    </Grid>
  );
}
