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
import { createRider, updateRider } from 'api/riders';

const EMPTY_FORM = { name: '', phone: '', is_online: false, is_available: true };

export default function RiderDialog({ open, rider, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEdit = Boolean(rider);

  useEffect(() => {
    if (open) {
      if (rider) {
        setForm({
          name: rider.name || '',
          phone: rider.phone || '',
          is_online: Boolean(rider.is_online),
          is_available: rider.is_available === undefined ? true : Boolean(rider.is_available)
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setError('');
    }
  }, [open, rider]);

  async function handleSave() {
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Name and phone are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (isEdit) {
        await updateRider(rider.id, form);
      } else {
        await createRider(form);
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {}).flat()[0] ||
        'Failed to save rider. Please try again.';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isEdit ? 'Edit Rider' : 'Add Rider'}
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
            label="Rider Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />

          <TextField
            fullWidth
            required
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          />

          <Stack direction="row" spacing={2}>
            <FormControlLabel
              control={<Checkbox checked={form.is_online} onChange={(e) => setForm((p) => ({ ...p, is_online: e.target.checked }))} />}
              label="Online"
            />
            <FormControlLabel
              control={
                <Checkbox checked={form.is_available} onChange={(e) => setForm((p) => ({ ...p, is_available: e.target.checked }))} />
              }
              label="Available"
            />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button color="inherit" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} loading={saving}>
          {isEdit ? 'Save Changes' : 'Create Rider'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
