import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import MainCard from 'components/MainCard';
import ProductsTable from 'sections/products/ProductsTable';

export default function Products() {
  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Stack spacing={0.5}>
          <Typography variant="h5">Products</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your menu items, variants, and pricing
          </Typography>
        </Stack>
      </Grid>
      <Grid size={12}>
        <MainCard content={false} sx={{ p: 2.5 }}>
          <ProductsTable />
        </MainCard>
      </Grid>
    </Grid>
  );
}
