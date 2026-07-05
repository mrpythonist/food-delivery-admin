import { useState } from 'react';
import { Avatar, Box, Button, Chip, Stack, Typography } from '@mui/material';
import EditOutlined from '@ant-design/icons/EditOutlined';
import MainCard from 'components/MainCard';
import CustomerDialog from 'sections/customers/CustomerDialog';

export default function CustomerHeader({ customer, onUpdate }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <MainCard>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={3}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ width: 64, height: 64, fontSize: 24 }}>{customer.first_name?.[0]}</Avatar>
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography variant="h4">
                {customer.first_name} {customer.last_name}
              </Typography>
              <Chip size="small" color={customer.is_active ? 'success' : 'default'} label={customer.is_active ? 'Active' : 'Inactive'} />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {customer.phone} • {customer.email || 'No email'}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Customer #{customer.id} • Joined {new Date(customer.created_at).toLocaleDateString()}
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="outlined"
          color="inherit"
          size="small"
          startIcon={<EditOutlined />}
          onClick={() => setDialogOpen(true)}
          sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
        >
          Edit Customer
        </Button>
      </Stack>

      <CustomerDialog open={dialogOpen} customer={customer} onClose={() => setDialogOpen(false)} onSaved={onUpdate} />
    </MainCard>
  );
}
