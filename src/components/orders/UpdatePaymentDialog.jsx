import { useEffect, useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from '@mui/material';

import { updateOrderPayment } from 'api/orders';

const PAYMENT_STATUS = ['pending', 'paid', 'failed', 'refunded'];

export default function UpdatePaymentDialog({ open, order, onClose, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(order.payment_status);

  useEffect(() => {
    if (open) {
      setPaymentStatus(order.payment_status);
    }
  }, [open, order]);

  async function handleSave() {
    setLoading(true);

    try {
      await updateOrderPayment(order.id, {
        payment_status: paymentStatus
      });

      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Payment Status</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField label="Payment Method" value={order.payment_method?.toUpperCase()} disabled fullWidth />

          <TextField select label="Payment Status" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} fullWidth>
            {PAYMENT_STATUS.map((status) => (
              <MenuItem key={status} value={status}>
                {status.replaceAll('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancel
        </Button>

        <Button variant="contained" onClick={handleSave} loading={loading}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
