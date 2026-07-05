import { useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { deleteCategory } from 'api/categories';

export default function DeleteCategoryDialog({ open, category, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  async function handleDelete() {
    setDeleting(true);
    setError('');
    try {
      await deleteCategory(category.id);
      onDeleted();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete category. It may still have products assigned to it.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onClose={deleting ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle>Delete Category</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography>
          Are you sure you want to delete <strong>{category?.name}</strong>? This cannot be undone.
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
