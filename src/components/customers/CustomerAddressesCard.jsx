import { useState } from 'react';
import { Box, Button, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import MainCard from 'components/MainCard';
import AddressDialog from 'sections/customers/AddressDialog';
import DeleteAddressDialog from 'sections/customers/DeleteAddressDialog';

export default function CustomerAddressesCard({ customerId, addresses, onUpdate }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deletingAddress, setDeletingAddress] = useState(null);

  function handleAdd() {
    setEditingAddress(null);
    setDialogOpen(true);
  }

  function handleEdit(address) {
    setEditingAddress(address);
    setDialogOpen(true);
  }

  return (
    <MainCard
      title="Addresses"
      secondary={
        <Button size="small" variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd}>
          Add Address
        </Button>
      }
    >
      {!addresses || addresses.length === 0 ? (
        <Typography color="text.disabled" fontStyle="italic" textAlign="center" sx={{ py: 3 }}>
          No addresses saved yet.
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {addresses.map((addr) => (
            <Box key={addr.id} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Stack spacing={0.3}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography fontWeight={600}>{addr.recipient_name}</Typography>
                    {addr.label && <Chip size="small" variant="outlined" label={addr.label} />}
                    {addr.is_default && <Chip size="small" color="primary" label="Default" />}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {addr.address_line_1}
                    {addr.address_line_2 ? `, ${addr.address_line_2}` : ''}, {addr.city}
                    {addr.state ? `, ${addr.state}` : ''} {addr.postal_code}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {addr.phone}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleEdit(addr)}>
                      <EditOutlined />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => setDeletingAddress(addr)}>
                      <DeleteOutlined />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}

      <AddressDialog
        open={dialogOpen}
        customerId={customerId}
        address={editingAddress}
        onClose={() => setDialogOpen(false)}
        onSaved={onUpdate}
      />

      <DeleteAddressDialog
        open={Boolean(deletingAddress)}
        address={deletingAddress}
        onClose={() => setDeletingAddress(null)}
        onDeleted={onUpdate}
      />
    </MainCard>
  );
}
