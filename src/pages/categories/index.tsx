import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import MainCard from 'components/MainCard';
import CategoriesTable from 'sections/categories/CategoriesTable';

export default function Categories() {
  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Stack spacing={0.5}>
          <Typography variant="h5">Categories</Typography>
          <Typography variant="body2" color="text.secondary">
            Organize your products into categories
          </Typography>
        </Stack>
      </Grid>
      <Grid size={12}>
        <MainCard content={false} sx={{ p: 2.5 }}>
          <CategoriesTable />
        </MainCard>
      </Grid>
    </Grid>
  );
}
