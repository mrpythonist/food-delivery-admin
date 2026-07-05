import { useEffect, useState } from 'react';
import { Alert, Button, Grid, InputAdornment, Skeleton, Snackbar, Stack, TextField, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { getSettings, updateSettings } from 'api/settings';
import { parseOpeningHours, serializeOpeningHours } from 'utils/openingHours';
import OpeningHoursEditor from 'sections/settings/OpeningHoursEditor';

const EMPTY_FORM = {
  restaurant_name: '',
  phone: '',
  address: '',
  delivery_fee: '',
  free_delivery_above: '',
  tax_percentage: '',
  easypaisa_title: '',
  easypaisa_number: '',
  jazzcash_title: '',
  jazzcash_number: '',
  currency: 'PKR'
};

export default function Settings() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [openingHours, setOpeningHours] = useState(parseOpeningHours(null));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    try {
      const { data } = await getSettings();
      setForm({
        restaurant_name: data.restaurant_name || '',
        phone: data.phone || '',
        address: data.address || '',
        delivery_fee: data.delivery_fee ?? '',
        free_delivery_above: data.free_delivery_above ?? '',
        tax_percentage: data.tax_percentage ?? '',
        easypaisa_title: data.easypaisa_title || '',
        easypaisa_number: data.easypaisa_number || '',
        jazzcash_title: data.jazzcash_title || '',
        jazzcash_number: data.jazzcash_number || '',
        currency: data.currency || 'PKR'
      });
      setOpeningHours(parseOpeningHours(data.opening_hours));
    } catch (err) {
      console.error(err);
      setError('Failed to load settings.');
    } finally {
      setLoading(false);
    }
  }

  function update(field, value) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        delivery_fee: Number(form.delivery_fee),
        free_delivery_above: Number(form.free_delivery_above),
        tax_percentage: Number(form.tax_percentage),
        opening_hours: serializeOpeningHours(openingHours)
      };
      await updateSettings(payload);
      setSnackbar({ open: true, message: 'Settings saved successfully', severity: 'success' });
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {}).flat()[0] ||
        'Failed to save settings. Please try again.';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((i) => (
          <Grid size={12} key={i}>
            <MainCard>
              <Skeleton variant="text" width={200} height={32} />
              <Skeleton variant="rounded" height={100} sx={{ mt: 1 }} />
            </MainCard>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Stack spacing={0.5}>
          <Typography variant="h5">Settings</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your restaurant's general, delivery, payment, and tax configuration
          </Typography>
        </Stack>
      </Grid>

      {error && (
        <Grid size={12}>
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </Grid>
      )}

      {/* General Info */}
      <Grid size={12}>
        <MainCard title="General Information">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Restaurant Name"
                value={form.restaurant_name}
                onChange={(e) => update('restaurant_name', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Address"
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
              />
            </Grid>
          </Grid>

          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
            Opening Hours
          </Typography>
          <OpeningHoursEditor hours={openingHours} onChange={setOpeningHours} />
        </MainCard>
      </Grid>

      {/* Delivery */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard title="Delivery">
          <Stack spacing={2}>
            <TextField
              fullWidth
              required
              type="number"
              label="Delivery Fee"
              value={form.delivery_fee}
              onChange={(e) => update('delivery_fee', e.target.value)}
              slotProps={{
                input: { startAdornment: <InputAdornment position="start">{form.currency}</InputAdornment> },
                htmlInput: { min: 0 }
              }}
            />
            <TextField
              fullWidth
              required
              type="number"
              label="Free Delivery Above"
              value={form.free_delivery_above}
              onChange={(e) => update('free_delivery_above', e.target.value)}
              helperText="Orders above this subtotal get free delivery"
              slotProps={{
                input: { startAdornment: <InputAdornment position="start">{form.currency}</InputAdornment> },
                htmlInput: { min: 0 }
              }}
            />
          </Stack>
        </MainCard>
      </Grid>

      {/* Tax & Currency */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard title="Tax & Currency">
          <Stack spacing={2}>
            <TextField
              fullWidth
              required
              type="number"
              label="Tax Percentage"
              value={form.tax_percentage}
              onChange={(e) => update('tax_percentage', e.target.value)}
              slotProps={{
                input: { endAdornment: <InputAdornment position="end">%</InputAdornment> },
                htmlInput: { min: 0, max: 100 }
              }}
            />
            <TextField
              fullWidth
              required
              label="Currency Code"
              placeholder="e.g. PKR, USD"
              value={form.currency}
              onChange={(e) => update('currency', e.target.value.toUpperCase())}
            />
          </Stack>
        </MainCard>
      </Grid>

      {/* Payment Methods */}
      <Grid size={12}>
        <MainCard title="Payment Methods">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" gutterBottom>
                EasyPaisa
              </Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  required
                  label="Account Title"
                  value={form.easypaisa_title}
                  onChange={(e) => update('easypaisa_title', e.target.value)}
                />
                <TextField
                  fullWidth
                  required
                  label="Account Number"
                  value={form.easypaisa_number}
                  onChange={(e) => update('easypaisa_number', e.target.value)}
                />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" gutterBottom>
                JazzCash
              </Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  required
                  label="Account Title"
                  value={form.jazzcash_title}
                  onChange={(e) => update('jazzcash_title', e.target.value)}
                />
                <TextField
                  fullWidth
                  required
                  label="Account Number"
                  value={form.jazzcash_number}
                  onChange={(e) => update('jazzcash_number', e.target.value)}
                />
              </Stack>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>

      <Grid size={12}>
        <Stack direction="row" style={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" size="large" onClick={handleSave} loading={saving}>
            Save Settings
          </Button>
        </Stack>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
