import { useState } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import ReloadOutlined from '@ant-design/icons/ReloadOutlined';
import ClearOutlined from '@ant-design/icons/ClearOutlined';

export default function ReportsDateFilter({ onApply, onClear }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  function handleApply() {
    onApply({ from, to });
  }

  function handleClear() {
    setFrom('');
    setTo('');
    onClear();
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} style={{ alignItems: 'flex-end' }}>
        <TextField
          size="small"
          type="date"
          label="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ maxWidth: 200 }}
        />
        <TextField
          size="small"
          type="date"
          label="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ maxWidth: 200 }}
        />
        <Button variant="contained" startIcon={<ReloadOutlined />} onClick={handleApply}>
          Apply
        </Button>
        <Button variant="outlined" color="inherit" startIcon={<ClearOutlined />} onClick={handleClear} disabled={!from && !to}>
          Clear
        </Button>
      </Stack>
    </Box>
  );
}
