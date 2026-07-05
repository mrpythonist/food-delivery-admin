import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Grid, Skeleton, Stack } from '@mui/material';
import { getCustomer } from 'api/customers';
import MainCard from 'components/MainCard';
import CustomerHeader from 'components/customers/CustomerHeader';
import CustomerStatsCard from 'components/customers/CustomerStatsCard';
import CustomerAddressesCard from 'components/customers/CustomerAddressesCard';

export default function CustomerDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState(false);

  const loadCustomer = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await getCustomer(id);
      setCustomer(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCustomer();
  }, [loadCustomer]);

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

  if (error || !customer) {
    return (
      <Alert severity="error" variant="outlined">
        Customer not found or failed to load. Please try again.
      </Alert>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <CustomerHeader customer={customer} onUpdate={loadCustomer} />
      </Grid>
      <Grid size={12}>
        <CustomerStatsCard orders={customer.orders} addressCount={customer.addresses?.length || 0} />
      </Grid>
      <Grid size={12}>
        <CustomerAddressesCard customerId={customer.id} addresses={customer.addresses} onUpdate={loadCustomer} />
      </Grid>
    </Grid>
  );
}
