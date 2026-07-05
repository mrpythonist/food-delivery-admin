import { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
  Alert
} from '@mui/material';
import CarOutlined from '@ant-design/icons/CarOutlined';
import { getRiders } from 'api/riders';
import { assignRider } from 'api/orders';

export default function AssignRiderDialog({ open, order, onClose, onUpdated }) {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(order?.rider?.id || null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setError('');
    setLoading(true);
    getRiders()
      .then(({ data }) => setRiders(data.data || data))
      .catch((err) => {
        console.error(err);
        setError('Could not load riders list.');
      })
      .finally(() => setLoading(false));
  }, [open]);

  async function handleAssign() {
    setSaving(true);
    setError('');
    try {
      await assignRider(order.id, selectedId);
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to assign rider. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Assign Rider</DialogTitle>
      <DialogContent dividers sx={{ p: 0, minHeight: 240 }}>
        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}
        {loading ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
            <CircularProgress size={28} />
          </Stack>
        ) : riders.length === 0 ? (
          <Typography color="text.secondary" sx={{ p: 3 }}>
            No available riders found.
          </Typography>
        ) : (
          <List disablePadding>
            {riders.map((rider) => (
              <ListItemButton key={rider.id} selected={selectedId === rider.id} onClick={() => setSelectedId(rider.id)}>
                <ListItemAvatar>
                  <Avatar>
                    <CarOutlined />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={rider.name} secondary={rider.phone} />
              </ListItemButton>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleAssign} loading={saving} disabled={!selectedId || selectedId === order?.rider?.id}>
          Assign Rider
        </Button>
      </DialogActions>
    </Dialog>
  );
}
