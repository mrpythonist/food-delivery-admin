import { useState } from 'react';
import { Avatar, Box, Button, Chip, Stack, Typography } from '@mui/material';
import EditOutlined from '@ant-design/icons/EditOutlined';
import MainCard from 'components/MainCard';
import RiderDialog from 'sections/riders/RiderDialog';

export default function RiderHeader({ rider, onUpdate }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <MainCard>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={3}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ width: 64, height: 64, fontSize: 24 }}>{rider.name?.[0]}</Avatar>
          <Box>
            <Typography variant="h4">{rider.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {rider.phone}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
              <Chip size="small" color={rider.is_online ? 'success' : 'default'} label={rider.is_online ? 'Online' : 'Offline'} />
              <Chip size="small" color={rider.is_available ? 'info' : 'default'} label={rider.is_available ? 'Available' : 'Unavailable'} />
            </Stack>
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
          Edit Rider
        </Button>
      </Stack>

      <RiderDialog open={dialogOpen} rider={rider} onClose={() => setDialogOpen(false)} onSaved={onUpdate} />
    </MainCard>
  );
}
