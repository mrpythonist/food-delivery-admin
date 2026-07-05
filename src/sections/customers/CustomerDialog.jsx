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
import { createCustomer, updateCustomer } from 'api/customers';

const EMPTY_FORM = { first_name: '', last_name: '', email: '', phone: '', is_active: true };

export default function CustomerDialog({ open, customer, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEdit = Boolean(customer);

  useEffect(() => {
    if (open) {
      if (customer) {
        setForm({
          first_name: customer.first_name || '',
          last_name: customer.last_name || '',
          email: customer.email || '',
          phone: customer.phone || '',
          is_active: customer.is_active === undefined ? true : Boolean(customer.is_active)
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setError('');
    }
  }, [open, customer]);

  async function handleSave() {
    if (!form.first_name.trim()) {
      setError('First name is required.');
      return;
    }
    if (!form.phone.trim()) {
      setError('Phone is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name || null,
        email: form.email || null,
        phone: form.phone,
        is_active: form.is_active
      };

      if (isEdit) {
        await updateCustomer(customer.id, payload);
      } else {
        await createCustomer(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {}).flat()[0] ||
        'Failed to save customer. Please try again.';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isEdit ? 'Edit Customer' : 'Add Customer'}
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
              label="First Name"
              value={form.first_name}
              onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Last Name"
              value={form.last_name}
              onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))}
            />
          </Stack>

          <TextField
            fullWidth
            required
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          />

          <TextField
            fullWidth
            type="email"
            label="Email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />

          <FormControlLabel
            control={<Checkbox checked={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} />}
            label="Active"
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button color="inherit" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} loading={saving}>
          {isEdit ? 'Save Changes' : 'Create Customer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
