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
  InputAdornment,
  MenuItem,
  Stack,
  TextField
} from '@mui/material';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import { createCoupon, updateCoupon } from 'api/coupons';

const EMPTY_FORM = {
  code: '',
  type: 'percentage',
  value: '',
  minimum_order: '',
  expires_at: '',
  is_active: true
};

export default function CouponDialog({ open, coupon, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEdit = Boolean(coupon);

  useEffect(() => {
    if (open) {
      if (coupon) {
        setForm({
          code: coupon.code || '',
          type: coupon.type || 'percentage',
          value: coupon.value ?? '',
          minimum_order: coupon.minimum_order ?? '',
          expires_at: coupon.expires_at ? coupon.expires_at.slice(0, 10) : '',
          is_active: Boolean(coupon.is_active)
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setError('');
    }
  }, [open, coupon]);

  async function handleSave() {
    if (!form.code.trim()) {
      setError('Coupon code is required.');
      return;
    }
    if (form.value === '' || Number(form.value) < 0) {
      setError('Please enter a valid value.');
      return;
    }
    if (form.type === 'percentage' && Number(form.value) > 100) {
      setError('Percentage value cannot exceed 100.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        code: form.code,
        type: form.type,
        value: Number(form.value),
        minimum_order: form.minimum_order === '' ? null : Number(form.minimum_order),
        expires_at: form.expires_at || null,
        is_active: form.is_active
      };

      if (isEdit) {
        await updateCoupon(coupon.id, payload);
      } else {
        await createCoupon(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {}).flat()[0] ||
        'Failed to save coupon. Please try again.';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isEdit ? 'Edit Coupon' : 'Add Coupon'}
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
            label="Coupon Code"
            placeholder="e.g. SUMMER25"
            value={form.code}
            onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
            helperText="Will be stored in uppercase"
          />

          <Stack direction="row" spacing={2}>
            <TextField
              select
              fullWidth
              label="Discount Type"
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
            >
              <MenuItem value="percentage">Percentage</MenuItem>
              <MenuItem value="fixed">Fixed Amount</MenuItem>
            </TextField>

            <TextField
              fullWidth
              required
              type="number"
              label="Value"
              value={form.value}
              onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">{form.type === 'percentage' ? '%' : 'PKR'}</InputAdornment>
                },
                htmlInput: { min: 0, max: form.type === 'percentage' ? 100 : undefined }
              }}
            />
          </Stack>

          <TextField
            fullWidth
            type="number"
            label="Minimum Order Amount (optional)"
            value={form.minimum_order}
            onChange={(e) => setForm((p) => ({ ...p, minimum_order: e.target.value }))}
            slotProps={{
              input: { startAdornment: <InputAdornment position="start">PKR</InputAdornment> },
              htmlInput: { min: 0 }
            }}
          />

          <TextField
            fullWidth
            type="date"
            label="Expires On (optional)"
            value={form.expires_at}
            onChange={(e) => setForm((p) => ({ ...p, expires_at: e.target.value }))}
            slotProps={{ inputLabel: { shrink: true } }}
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
          {isEdit ? 'Save Changes' : 'Create Coupon'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
