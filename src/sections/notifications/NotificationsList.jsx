import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Pagination,
  Snackbar,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import useNotifications from 'hooks/useNotifications';
import { markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from 'api/notifications';
import { getNotifiableName, getNotifiableType, formatRelativeTime } from 'utils/notificationHelpers';

export default function NotificationsList() {
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const params = useMemo(() => {
    const p = { page, per_page: 15 };
    if (unreadOnly) p.unread_only = 1;
    return p;
  }, [page, unreadOnly]);

  const { notifications, totalRows, unreadCount, loading, refresh, refreshUnreadCount } = useNotifications(params);

  const totalPages = Math.ceil((totalRows || 0) / 15);

  async function handleMarkRead(id) {
    try {
      await markNotificationAsRead(id);
      refresh();
      refreshUnreadCount();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to mark as read.', severity: 'error' });
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsAsRead();
      refresh();
      refreshUnreadCount();
      setSnackbar({ open: true, message: 'All notifications marked as read', severity: 'success' });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to mark all as read.', severity: 'error' });
    }
  }

  async function handleDelete(id) {
    try {
      await deleteNotification(id);
      refresh();
      refreshUnreadCount();
      setSnackbar({ open: true, message: 'Notification deleted', severity: 'success' });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to delete notification.', severity: 'error' });
    }
  }

  return (
    <Box>
      <Stack direction="row" style={{ justifyContent: 'space-between', alignItems: 'center' }} sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1}>
          <Chip
            label="All"
            color={!unreadOnly ? 'primary' : 'default'}
            onClick={() => {
              setUnreadOnly(false);
              setPage(1);
            }}
          />
          <Chip
            label={`Unread (${unreadCount})`}
            color={unreadOnly ? 'primary' : 'default'}
            onClick={() => {
              setUnreadOnly(true);
              setPage(1);
            }}
          />
        </Stack>
        {unreadCount > 0 && (
          <Button size="small" startIcon={<CheckOutlined />} onClick={handleMarkAllRead}>
            Mark all as read
          </Button>
        )}
      </Stack>

      {!loading && notifications.length === 0 ? (
        <Alert severity="info" variant="outlined">
          {unreadOnly ? "You're all caught up — no unread notifications." : 'No notifications yet.'}
        </Alert>
      ) : (
        <List sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
          {notifications.map((n, idx) => (
            <Box key={n.id}>
              <ListItemButton
                onClick={() => !n.read_at && handleMarkRead(n.id)}
                sx={{ bgcolor: n.read_at ? 'transparent' : 'action.hover', py: 1.5 }}
              >
                <ListItemText
                  disableTypography
                  primary={
                    <Stack direction="row" spacing={1} style={{ alignItems: 'center' }}>
                      <Typography fontWeight={n.read_at ? 400 : 700}>{n.title}</Typography>
                      <Chip size="small" variant="outlined" label={getNotifiableType(n) === 'rider' ? 'Rider' : 'Customer'} />
                      {!n.read_at && <Chip size="small" color="primary" label="New" />}
                    </Stack>
                  }
                  secondary={
                    <Stack spacing={0.3} sx={{ mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {getNotifiableName(n)} — {n.message}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {formatRelativeTime(n.created_at)}
                      </Typography>
                    </Stack>
                  }
                />
                <Stack direction="row" spacing={0.5}>
                  {!n.read_at && (
                    <Tooltip title="Mark as read">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkRead(n.id);
                        }}
                      >
                        <CheckOutlined />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(n.id);
                      }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </ListItemButton>
              {idx < notifications.length - 1 && <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}
            </Box>
          ))}
        </List>
      )}

      {totalPages > 1 && (
        <Stack style={{ alignItems: 'center' }} sx={{ mt: 3 }}>
          <Pagination count={totalPages} page={page} onChange={(e, val) => setPage(val)} color="primary" />
        </Stack>
      )}

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
    </Box>
  );
}
