import { useEffect, useState } from 'react';
import { Box, Button, MenuItem, Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import ReloadOutlined from '@ant-design/icons/ReloadOutlined';
import DownloadOutlined from '@ant-design/icons/DownloadOutlined';
import ClearOutlined from '@ant-design/icons/ClearOutlined';
import { ORDER_STATUSES, PAYMENT_STATUSES } from 'utils/orderStatus';

const DEBOUNCE_MS = 400;

export default function OrdersFilters({ filters, onChange, onClear, onExport, onRefresh, exporting }) {
  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounce search text before pushing it up to parent
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onChange({ search: searchInput });
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const hasActiveFilters =
    filters.search || filters.status !== 'all' || filters.payment_status !== 'all' || filters.date_from || filters.date_to;

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} style={{ alignItems: 'center' }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search order #, customer, phone..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <SearchOutlined style={{ marginRight: 8, color: '#8c8c8c' }} />
              }
            }}
          />
        </Grid>

        <Grid size={{ xs: 6, md: 2 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Status"
            value={filters.status}
            onChange={(e) => onChange({ status: e.target.value })}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            {ORDER_STATUSES.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 6, md: 2 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Payment"
            value={filters.payment_status}
            onChange={(e) => onChange({ payment_status: e.target.value })}
          >
            <MenuItem value="all">All Payments</MenuItem>
            {PAYMENT_STATUSES.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 6, md: 2 }}>
          <TextField
            fullWidth
            size="small"
            type="date"
            label="From"
            value={filters.date_from}
            onChange={(e) => onChange({ date_from: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>

        <Grid size={{ xs: 6, md: 2 }}>
          <TextField
            fullWidth
            size="small"
            type="date"
            label="To"
            value={filters.date_to}
            onChange={(e) => onChange({ date_to: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 1 }}>
          <Stack direction="row" spacing={1} style={{ justifyContent: 'flex-end' }}>
            <Button size="small" variant="outlined" color="inherit" onClick={onRefresh} sx={{ minWidth: 0, px: 1.2 }}>
              <ReloadOutlined />
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <Stack direction="row" style={{ justifyContent: 'space-between', alignItems: 'center' }} sx={{ mt: 2 }}>
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

        <Button
          size="small"
          variant="contained"
          startIcon={<DownloadOutlined />}
          onClick={onExport}
          loading={exporting}
          loadingPosition="start"
        >
          Export CSV
        </Button>
      </Stack>
    </Box>
  );
}
