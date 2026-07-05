import { Avatar, Stack, Typography, Chip, Divider } from '@mui/material';
import MailOutlined from '@ant-design/icons/MailOutlined';
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';
import EnvironmentOutlined from '@ant-design/icons/EnvironmentOutlined';
import MainCard from 'components/MainCard';

export default function CustomerCard({ customer, address }) {
  return (
    <MainCard title="Customer Information">
      <Stack direction="row" spacing={2} style={{ alignItems: 'center' }} sx={{ mb: 2 }}>
        <Avatar sx={{ width: 56, height: 56, bgcolor: 'secondary.lighter', color: 'secondary.main' }}>{customer.first_name?.[0]}</Avatar>
        <Stack spacing={0.3}>
          <Typography variant="h6">
            {customer.first_name} {customer.last_name}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Customer ID #{customer.id}
          </Typography>
        </Stack>
      </Stack>
      <Stack spacing={1.2}>
        <Stack direction="row" spacing={1} style={{ alignItems: 'center' }} color="text.secondary">
          <MailOutlined style={{ fontSize: 14 }} />
          <Typography variant="body2">{customer.email || '-'}</Typography>
        </Stack>
        <Stack direction="row" spacing={1} style={{ alignItems: 'center' }} color="text.secondary">
          <PhoneOutlined style={{ fontSize: 14 }} />
          <Typography variant="body2">{customer.phone}</Typography>
        </Stack>
      </Stack>
      <Divider sx={{ my: 2.5 }} />
      <Stack spacing={0.4}>
        <Typography variant="body2" color="text.secondary">
          <EnvironmentOutlined style={{ fontSize: 18, marginTop: 3, color: '#8c8c8c' }} /> {address.address_line_1}
          {address.address_line_2 ? `, ${address.address_line_2}` : ''}
          {`, ${address.city}, ${address.state}, ${address.postal_code}`}
        </Typography>
        {address.label && <Chip size="small" variant="outlined" label={address.label} sx={{ width: 'fit-content' }} />}
      </Stack>
    </MainCard>
  );
}
