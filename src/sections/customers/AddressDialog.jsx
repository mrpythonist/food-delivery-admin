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
import { createAddress, updateAddress } from 'api/addresses';

const EMPTY_FORM = {
  label: '',
  recipient_name: '',
  phone: '',
  address_line_1: '',
  address_line_2: '',
  city: '',
  state: '',
  postal_code: '',
  is_default: false
};

export default function AddressDialog({ open, customerId, address, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEdit = Boolean(address);

  useEffect(() => {
    if (open) {
      if (address) {
        setForm({
          label: address.label || '',
          recipient_name: address.recipient_name || '',
          phone: address.phone || '',
          address_line_1: address.address_line_1 || '',
          address_line_2: address.address_line_2 || '',
          city: address.city || '',
          state: address.state || '',
          postal_code: address.postal_code || '',
          is_default: Boolean(address.is_default)
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setError('');
    }
  }, [open, address]);

  async function handleSave() {
    if (!form.recipient_name.trim() || !form.phone.trim() || !form.address_line_1.trim() || !form.city.trim()) {
      setError('Recipient name, phone, address line 1, and city are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, customer_id: customerId };

      if (isEdit) {
        await updateAddress(address.id, payload);
      } else {
        await createAddress(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {}).flat()[0] ||
        'Failed to save address. Please try again.';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isEdit ? 'Edit Address' : 'Add Address'}
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

          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              required
              label="Recipient Name"
              value={form.recipient_name}
              onChange={(e) => setForm((p) => ({ ...p, recipient_name: e.target.value }))}
            />
            <TextField
              fullWidth
              required
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            />
          </Stack>

          <TextField
            fullWidth
            label="Label (e.g. Home, Office)"
            value={form.label}
            onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
          />

          <TextField
            fullWidth
            required
            label="Address Line 1"
            value={form.address_line_1}
            onChange={(e) => setForm((p) => ({ ...p, address_line_1: e.target.value }))}
          />

          <TextField
            fullWidth
            label="Address Line 2"
            value={form.address_line_2}
            onChange={(e) => setForm((p) => ({ ...p, address_line_2: e.target.value }))}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              required
              label="City"
              value={form.city}
              onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
            />
            <TextField fullWidth label="State" value={form.state} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))} />
            <TextField
              fullWidth
              label="Postal Code"
              value={form.postal_code}
              onChange={(e) => setForm((p) => ({ ...p, postal_code: e.target.value }))}
            />
          </Stack>

          <FormControlLabel
            control={<Checkbox checked={form.is_default} onChange={(e) => setForm((p) => ({ ...p, is_default: e.target.checked }))} />}
            label="Set as default address"
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button color="inherit" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} loading={saving}>
          {isEdit ? 'Save Changes' : 'Add Address'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
