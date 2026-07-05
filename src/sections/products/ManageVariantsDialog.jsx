import { useEffect, useState, useCallback } from 'react';
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import { getProduct } from 'api/products';
import { deleteVariant } from 'api/variants';
import { money } from 'utils/productHelpers';
import VariantDialog from './VariantDialog';

export default function ManageVariantsDialog({ open, product, onClose, onChanged }) {
  const [variants, setVariants] = useState(product?.variants || []);
  const [loading, setLoading] = useState(false);
  const [variantDialogOpen, setVariantDialogOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [deletingVariant, setDeletingVariant] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const refreshVariants = useCallback(async () => {
    if (!product) return;
    setLoading(true);
    try {
      const { data } = await getProduct(product.id);
      setVariants(data.variants || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [product]);

  useEffect(() => {
    if (open && product) {
      setVariants(product.variants || []);
    }
  }, [open, product]);

  function handleAdd() {
    setEditingVariant(null);
    setVariantDialogOpen(true);
  }

  function handleEdit(variant) {
    setEditingVariant(variant);
    setVariantDialogOpen(true);
  }

  async function handleVariantSaved() {
    await refreshVariants();
    onChanged?.();
    setSnackbar({ open: true, message: 'Variant saved', severity: 'success' });
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteVariant(deletingVariant.id);
      setDeletingVariant(null);
      await refreshVariants();
      onChanged?.();
      setSnackbar({ open: true, message: 'Variant deleted', severity: 'success' });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to delete variant.', severity: 'error' });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Variants — {product?.name}
          <IconButton onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          <Stack direction="row" justifyContent="flex-end" sx={{ p: 2 }}>
            <Button size="small" variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd}>
              Add Variant
            </Button>
          </Stack>

          {loading ? (
            <Stack alignItems="center" sx={{ py: 4 }}>
              <CircularProgress size={24} />
            </Stack>
          ) : variants.length === 0 ? (
            <Typography color="text.disabled" fontStyle="italic" textAlign="center" sx={{ py: 4 }}>
              No variants yet. Add one to get started.
            </Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Default</TableCell>
                  <TableCell align="center">Active</TableCell>
                  <TableCell width={90} />
                </TableRow>
              </TableHead>
              <TableBody>
                {variants.map((v) => (
                  <TableRow key={v.id} hover>
                    <TableCell>{v.name}</TableCell>
                    <TableCell align="right">{money(v.price)}</TableCell>
                    <TableCell align="center">{v.is_default && <Chip size="small" color="primary" label="Default" />}</TableCell>
                    <TableCell align="center">
                      <Chip size="small" color={v.is_active ? 'success' : 'default'} label={v.is_active ? 'Active' : 'Inactive'} />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => handleEdit(v)}>
                            <EditOutlined />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => setDeletingVariant(v)}>
                            <DeleteOutlined />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <VariantDialog
        open={variantDialogOpen}
        productId={product?.id}
        variant={editingVariant}
        onClose={() => setVariantDialogOpen(false)}
        onSaved={handleVariantSaved}
      />

      <Dialog open={Boolean(deletingVariant)} onClose={() => setDeletingVariant(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Variant</DialogTitle>
        <DialogContent>
          <Typography>
            Delete <strong>{deletingVariant?.name}</strong>? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button color="inherit" onClick={() => setDeletingVariant(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete} loading={deleting}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
