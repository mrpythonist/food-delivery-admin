import { useEffect, useState } from 'react';
import { Autocomplete, Box, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { getCustomers, getCustomer } from 'api/customers';

export default function StepCustomer({
  customerMode,
  setCustomerMode,
  selectedCustomer,
  setSelectedCustomer,
  newCustomer,
  setNewCustomer
}) {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customerMode !== 'existing') return undefined;
    if (!inputValue) {
      setOptions([]);
      return undefined;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await getCustomers({ search: inputValue, per_page: 10 });
        setOptions(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [inputValue, customerMode]);

  async function handleSelect(customer) {
    if (!customer) {
      setSelectedCustomer(null);
      return;
    }
    // list endpoint doesn't include addresses — fetch full detail so we know their saved addresses
    try {
      const { data } = await getCustomer(customer.id);
      setSelectedCustomer(data);
    } catch (err) {
      console.error(err);
      setSelectedCustomer(customer);
    }
  }

  return (
    <Stack spacing={3}>
      <ToggleButtonGroup exclusive color="primary" size="small" value={customerMode} onChange={(e, val) => val && setCustomerMode(val)}>
        <ToggleButton value="existing">Existing Customer</ToggleButton>
        <ToggleButton value="new">New Customer</ToggleButton>
      </ToggleButtonGroup>

      {customerMode === 'existing' ? (
        <Autocomplete
          options={options}
          loading={loading}
          value={selectedCustomer}
          onChange={(e, val) => handleSelect(val)}
          onInputChange={(e, val) => setInputValue(val)}
          getOptionLabel={(o) => `${o.first_name} ${o.last_name || ''} — ${o.phone}`}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          renderInput={(params) => <TextField {...params} label="Search customer by name, email, or phone" placeholder="Start typing..." />}
        />
      ) : (
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              required
              label="First Name"
              value={newCustomer.first_name}
              onChange={(e) => setNewCustomer((p) => ({ ...p, first_name: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Last Name"
              value={newCustomer.last_name}
              onChange={(e) => setNewCustomer((p) => ({ ...p, last_name: e.target.value }))}
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              required
              label="Phone"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer((p) => ({ ...p, phone: e.target.value }))}
            />
            <TextField
              fullWidth
              type="email"
              label="Email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer((p) => ({ ...p, email: e.target.value }))}
            />
          </Stack>
        </Stack>
      )}

      {selectedCustomer && customerMode === 'existing' && (
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1.5 }}>
          <Typography variant="subtitle2">
            {selectedCustomer.first_name} {selectedCustomer.last_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedCustomer.phone} • {selectedCustomer.email || 'No email'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {selectedCustomer.addresses?.length || 0} saved address(es)
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
