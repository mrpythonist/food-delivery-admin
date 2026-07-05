import { useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { deleteAddress } from 'api/addresses';

export default function DeleteAddressDialog({ open, address, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  async function handleDelete() {
    setDeleting(true);
    setError('');
    try {
      await deleteAddress(address.id);
      onDeleted();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete address.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onClose={deleting ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle>Delete Address</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography>
          Delete the address for <strong>{address?.recipient_name}</strong>? This cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button color="inherit" onClick={onClose} disabled={deleting}>
          Cancel
        </Button>
        <Button variant="contained" color="error" onClick={handleDelete} loading={deleting}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
