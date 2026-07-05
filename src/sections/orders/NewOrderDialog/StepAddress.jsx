import {
  Box,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';

export default function StepAddress({
  savedAddresses,
  addressMode,
  setAddressMode,
  selectedAddressId,
  setSelectedAddressId,
  newAddress,
  setNewAddress
}) {
  const hasSaved = savedAddresses && savedAddresses.length > 0;

  return (
    <Stack spacing={3}>
      {hasSaved && (
        <ToggleButtonGroup exclusive color="primary" size="small" value={addressMode} onChange={(e, val) => val && setAddressMode(val)}>
          <ToggleButton value="existing">Use Saved Address</ToggleButton>
          <ToggleButton value="new">Add New Address</ToggleButton>
        </ToggleButtonGroup>
      )}

      {addressMode === 'existing' && hasSaved ? (
        <RadioGroup value={selectedAddressId || ''} onChange={(e) => setSelectedAddressId(Number(e.target.value))}>
          <Stack spacing={1.5}>
            {savedAddresses.map((addr) => (
              <Box
                key={addr.id}
                sx={{
                  border: '1px solid',
                  borderColor: selectedAddressId === addr.id ? 'primary.main' : 'divider',
                  borderRadius: 1.5,
                  p: 1.5
                }}
              >
                <FormControlLabel
                  value={addr.id}
                  control={<Radio size="small" />}
                  sx={{ alignItems: 'flex-start', m: 0 }}
                  label={
                    <Stack spacing={0.2}>
                      <Typography fontWeight={600} variant="body2">
                        {addr.recipient_name} {addr.label && `(${addr.label})`}
                        {addr.is_default && (
                          <Typography component="span" variant="caption" color="primary.main" sx={{ ml: 1 }}>
                            Default
                          </Typography>
                        )}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {addr.address_line_1}
                        {addr.address_line_2 ? `, ${addr.address_line_2}` : ''}, {addr.city} {addr.state} {addr.postal_code}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {addr.phone}
                      </Typography>
                    </Stack>
                  }
                />
              </Box>
            ))}
          </Stack>
        </RadioGroup>
      ) : (
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              required
              label="Recipient Name"
              value={newAddress.recipient_name}
              onChange={(e) => setNewAddress((p) => ({ ...p, recipient_name: e.target.value }))}
            />
            <TextField
              fullWidth
              required
              label="Phone"
              value={newAddress.phone}
              onChange={(e) => setNewAddress((p) => ({ ...p, phone: e.target.value }))}
            />
          </Stack>
          <TextField
            fullWidth
            label="Label (e.g. Home, Office)"
            value={newAddress.label}
            onChange={(e) => setNewAddress((p) => ({ ...p, label: e.target.value }))}
          />
          <TextField
            fullWidth
            required
            label="Address Line 1"
            value={newAddress.address_line_1}
            onChange={(e) => setNewAddress((p) => ({ ...p, address_line_1: e.target.value }))}
          />
          <TextField
            fullWidth
            label="Address Line 2"
            value={newAddress.address_line_2}
            onChange={(e) => setNewAddress((p) => ({ ...p, address_line_2: e.target.value }))}
          />
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              required
              label="City"
              value={newAddress.city}
              onChange={(e) => setNewAddress((p) => ({ ...p, city: e.target.value }))}
            />
            <TextField
              fullWidth
              label="State"
              value={newAddress.state}
              onChange={(e) => setNewAddress((p) => ({ ...p, state: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Postal Code"
              value={newAddress.postal_code}
              onChange={(e) => setNewAddress((p) => ({ ...p, postal_code: e.target.value }))}
            />
          </Stack>
          <FormControlLabel
            control={
              <Checkbox checked={newAddress.is_default} onChange={(e) => setNewAddress((p) => ({ ...p, is_default: e.target.checked }))} />
            }
            label="Set as default address"
          />
        </Stack>
      )}
    </Stack>
  );
}
