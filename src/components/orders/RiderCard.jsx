import { useState } from 'react';
import { Avatar, Button, Stack, Typography } from '@mui/material';
import CarOutlined from '@ant-design/icons/CarOutlined';
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';
import UserSwitchOutlined from '@ant-design/icons/UserSwitchOutlined';
import MainCard from 'components/MainCard';
import AssignRiderDialog from './AssignRiderDialog';

export default function RiderCard({ order, onUpdate }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <MainCard title="Assigned Rider">
      {order.rider ? (
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} style={{ alignItems: 'center' }}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.lighter', color: 'primary.main' }}>{order.rider.name?.[0]}</Avatar>
            <Stack spacing={0.3}>
              <Typography variant="h6">{order.rider.name}</Typography>
              <Stack direction="row" spacing={0.6} style={{ alignItems: 'center' }} color="text.secondary">
                <PhoneOutlined style={{ fontSize: 13 }} />
                <Typography variant="body2">{order.rider.phone}</Typography>
              </Stack>
              <Typography variant="caption" color="text.disabled">
                Rider ID #{order.rider.id}
              </Typography>
            </Stack>
          </Stack>
          <Button
            size="small"
            variant="outlined"
            color="inherit"
            startIcon={<UserSwitchOutlined />}
            onClick={() => setDialogOpen(true)}
            sx={{ alignSelf: 'flex-start' }}
          >
            Reassign Rider
          </Button>
        </Stack>
      ) : (
        <Stack spacing={2} style={{ alignItems: 'flex-start' }}>
          <Stack direction="row" spacing={1.5} style={{ alignItems: 'center' }} color="text.secondary">
            <CarOutlined style={{ fontSize: 20 }} />
            <Typography color="text.secondary">Rider has not been assigned yet.</Typography>
          </Stack>
          <Button size="small" variant="contained" onClick={() => setDialogOpen(true)}>
            Assign Rider
          </Button>
        </Stack>
      )}

      <AssignRiderDialog open={dialogOpen} order={order} onClose={() => setDialogOpen(false)} onUpdated={onUpdate} />
    </MainCard>
  );
}
