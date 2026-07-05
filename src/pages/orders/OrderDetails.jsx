import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Grid, Skeleton, Stack } from '@mui/material';
import { getOrder } from 'api/orders';
import MainCard from 'components/MainCard';
import OrderHeader from '../../components/orders/OrderHeader';
import CustomerCard from '../../components/orders/CustomerCard';
import RiderCard from '../../components/orders/RiderCard';
import TimelineCard from '../../components/orders/TimelineCard';
import NotesCard from '../../components/orders/NotesCard';
import ItemsCard from '../../components/orders/ItemsCard';

export default function OrderDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(false);

  const loadOrder = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await getOrder(id);
      setOrder(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  if (loading) {
    return (
      <Grid container spacing={3}>
        <Grid size={12}>
          <MainCard>
            <Skeleton variant="text" width={220} height={40} />
            <Skeleton variant="text" width={160} />
          </MainCard>
        </Grid>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid size={{ xs: 12, lg: 6 }} key={i}>
            <MainCard>
              <Stack spacing={1.5}>
                <Skeleton variant="text" width="40%" height={28} />
                <Skeleton variant="rounded" height={120} />
              </Stack>
            </MainCard>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error || !order) {
    return (
      <Alert severity="error" variant="outlined">
        Order not found or failed to load. Please try again.
      </Alert>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <TimelineCard order={order} onUpdate={loadOrder} />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <OrderHeader order={order} />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Stack spacing={2}>
          <CustomerCard customer={order.customer} address={order.address} />
          <RiderCard order={order} onUpdate={loadOrder} />
        </Stack>
      </Grid>
      <Grid size={12}>
        <NotesCard notes={order.notes} />
      </Grid>
      <Grid size={12}>
        <ItemsCard order={order} />
      </Grid>
    </Grid>
  );
}
