import { useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { deleteProduct } from 'api/products';

export default function DeleteProductDialog({ open, product, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  async function handleDelete() {
    setDeleting(true);
    setError('');
    try {
      await deleteProduct(product.id);
      onDeleted();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete product.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onClose={deleting ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle>Delete Product</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography>
          Are you sure you want to delete <strong>{product?.name}</strong> and all its variants? This cannot be undone.
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
