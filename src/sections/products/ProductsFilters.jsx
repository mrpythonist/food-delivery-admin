import { useEffect, useState } from 'react';
import { Box, Button, MenuItem, Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import ReloadOutlined from '@ant-design/icons/ReloadOutlined';
import ClearOutlined from '@ant-design/icons/ClearOutlined';

const DEBOUNCE_MS = 400;

export default function ProductsFilters({ filters, onChange, onClear, onRefresh, categories }) {
  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onChange({ search: searchInput });
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const hasActiveFilters = filters.search || filters.category_id !== 'all' || filters.is_active !== 'all' || filters.is_featured !== 'all';

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} style={{ alignItems: 'center' }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search products by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <SearchOutlined style={{ marginRight: 8, color: '#8c8c8c' }} />
              }
            }}
          />
        </Grid>

        <Grid size={{ xs: 6, md: 2.5 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Category"
            value={filters.category_id}
            onChange={(e) => onChange({ category_id: e.target.value })}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 6, md: 2 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Active"
            value={filters.is_active}
            onChange={(e) => onChange({ is_active: e.target.value })}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </TextField>
        </Grid>

        <Grid size={{ xs: 6, md: 2 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Featured"
            value={filters.is_featured}
            onChange={(e) => onChange({ is_featured: e.target.value })}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="true">Featured</MenuItem>
            <MenuItem value="false">Not Featured</MenuItem>
          </TextField>
        </Grid>

        <Grid size={{ xs: 6, md: 1.5 }}>
          <Stack direction="row" spacing={1} style={{ justifyContent: 'flex-end' }}>
            <Button size="small" variant="outlined" color="inherit" onClick={onRefresh} sx={{ minWidth: 0, px: 1.2 }}>
              <ReloadOutlined />
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <Stack direction="row" style={{ justifyContent: 'flex-start' }} sx={{ mt: 2 }}>
        <Button
          size="small"
          startIcon={<ClearOutlined />}
          onClick={() => {
            setSearchInput('');
            onClear();
          }}
          disabled={!hasActiveFilters}
        >
          Clear Filters
        </Button>
      </Stack>
    </Box>
  );
}
