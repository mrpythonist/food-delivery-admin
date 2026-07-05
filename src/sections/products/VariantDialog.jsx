import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  TextField
} from '@mui/material';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import { createVariant, updateVariant } from 'api/variants';

const EMPTY_FORM = { name: '', price: '', is_default: false, is_active: true };

export default function VariantDialog({ open, productId, variant, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEdit = Boolean(variant);

  useEffect(() => {
    if (open) {
      if (variant) {
        setForm({
          name: variant.name || '',
          price: variant.price ?? '',
          is_default: Boolean(variant.is_default),
          is_active: Boolean(variant.is_active)
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setError('');
    }
  }, [open, variant]);

  async function handleSave() {
    if (!form.name.trim()) {
      setError('Variant name is required.');
      return;
    }
    if (form.price === '' || Number(form.price) < 0) {
      setError('Please enter a valid price.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        product_id: productId,
        name: form.name,
        price: Number(form.price),
        is_default: form.is_default,
        is_active: form.is_active
      };

      if (isEdit) {
        await updateVariant(variant.id, payload);
      } else {
        await createVariant(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {}).flat()[0] ||
        'Failed to save variant. Please try again.';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isEdit ? 'Edit Variant' : 'Add Variant'}
        <IconButton onClick={onClose} disabled={saving}>
          <CloseOutlined />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ mt: 0.5 }}>
          {error && (
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            required
            label="Variant Name"
            placeholder="e.g. Small, Large, 12-inch"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />

          <TextField
            fullWidth
            required
            type="number"
            label="Price (PKR)"
            value={form.price}
            onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
            slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
          />

          <Stack direction="row" spacing={2}>
            <FormControlLabel
              control={<Checkbox checked={form.is_default} onChange={(e) => setForm((p) => ({ ...p, is_default: e.target.checked }))} />}
              label="Default Variant"
            />
            <FormControlLabel
              control={<Checkbox checked={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} />}
              label="Active"
            />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button color="inherit" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} loading={saving}>
          {isEdit ? 'Save Changes' : 'Add Variant'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
