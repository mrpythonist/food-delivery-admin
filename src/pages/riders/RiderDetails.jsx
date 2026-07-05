import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Grid, Skeleton, Stack } from '@mui/material';
import { getRider, getRiderOrders } from 'api/riders';
import MainCard from 'components/MainCard';
import RiderHeader from 'components/riders/RiderHeader';
import RiderStatsCard from 'components/riders/RiderStatsCard';
import RiderLocationCard from 'components/riders/RiderLocationCard';
import RiderOrdersCard from 'components/riders/RiderOrdersCard';

export default function RiderDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [rider, setRider] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(false);

  const loadRider = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [riderRes, ordersRes] = await Promise.all([getRider(id), getRiderOrders(id)]);
      setRider(riderRes.data);
      setOrders(ordersRes.data || []);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadRider();
  }, [loadRider]);

  if (loading) {
    return (
      <Grid container spacing={3}>
        <Grid size={12}>
          <MainCard>
            <Skeleton variant="text" width={220} height={40} />
            <Skeleton variant="text" width={160} />
          </MainCard>
        </Grid>
        {[1, 2].map((i) => (
          <Grid size={{ xs: 12, lg: 6 }} key={i}>
            <MainCard>
              <Stack spacing={1.5}>
                <Skeleton variant="text" width="40%" height={28} />
                <Skeleton variant="rounded" height={140} />
              </Stack>
            </MainCard>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error || !rider) {
    return (
      <Alert severity="error" variant="outlined">
        Rider not found or failed to load. Please try again.
      </Alert>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <RiderHeader rider={rider} onUpdate={loadRider} />
      </Grid>
      <Grid size={12}>
        <RiderStatsCard orders={orders} />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <RiderLocationCard riderId={rider.id} />
      </Grid>
      <Grid size={12}>
        <RiderOrdersCard orders={orders} />
      </Grid>
    </Grid>
  );
}
