import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField, Typography, Alert } from '@mui/material';
import { ORDER_STATUSES, statusLabel } from 'utils/orderStatus';
import { updateOrderStatus } from 'api/orders';

export default function UpdateStatusDialog({ open, order, onClose, onUpdated }) {
  const [status, setStatus] = useState(order?.status || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      await updateOrderStatus(order.id, status);
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to update status. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Update Order Status</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Order <strong>{order?.order_number}</strong> — current status: <strong>{statusLabel(order?.status)}</strong>
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField select fullWidth label="New Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            {ORDER_STATUSES.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} loading={saving} disabled={!status || status === order?.status}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
