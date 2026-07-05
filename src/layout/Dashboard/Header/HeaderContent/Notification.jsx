import { useRef, useState, useEffect, useCallback } from 'react';
// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
// project imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import Transitions from 'components/@extended/Transitions';
import { useNavigate } from 'react-router-dom';
// api
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, getUnreadNotificationCount } from 'api/notifications';
import { getNotifiableName, formatRelativeTime } from 'utils/notificationHelpers';
// assets
import BellOutlined from '@ant-design/icons/BellOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import CarOutlined from '@ant-design/icons/CarOutlined';
// sx styles
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};
const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};
// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //
export default function Notification() {
  const navigate = useNavigate();
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const { data } = await getUnreadNotificationCount();
      setUnreadCount(data.unread_count);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getNotifications({ per_page: 5 });
      setNotifications(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    const timer = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(timer);
  }, [fetchUnreadCount]);

  const handleToggle = () => {
    if (!open) fetchNotifications();
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  async function handleItemClick(notification) {
    if (!notification.read_at) {
      try {
        await markNotificationAsRead(notification.id);
        fetchNotifications();
        fetchUnreadCount();
      } catch (err) {
        console.error(err);
      }
    }
    setOpen(false);
    navigate('/notifications');
  }

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsAsRead();
      fetchNotifications();
      fetchUnreadCount();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        variant="light"
        sx={(theme) => ({
          color: 'text.primary',
          bgcolor: open ? 'grey.100' : 'transparent'
        })}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={unreadCount} color="primary" max={99}>
          <BellOutlined />
        </Badge>
      </IconButton>
      <Popper
        placement={downMD ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [downMD ? -5 : 0, 9] } }] }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position={downMD ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper sx={(theme) => ({ boxShadow: theme.customShadows.z1, width: '100%', minWidth: 285, maxWidth: { xs: 285, md: 420 } })}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Notification"
                  elevation={0}
                  border={false}
                  content={false}
                  secondary={
                    <>
                      {unreadCount > 0 && (
                        <Tooltip title="Mark as all read">
                          <IconButton color="success" size="small" onClick={handleMarkAllRead}>
                            <CheckCircleOutlined style={{ fontSize: '1.15rem' }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  }
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : (
                    <List
                      component="nav"
                      sx={{
                        p: 0,
                        '& .MuiListItemButton-root': {
                          py: 0.5,
                          px: 2,
                          '&.Mui-selected': { bgcolor: 'grey.50', color: 'text.primary' },
                          '& .MuiAvatar-root': avatarSX,
                          '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                        }
                      }}
                    >
                      {notifications.length === 0 ? (
                        <ListItem>
                          <ListItemText
                            primary={
                              <Typography color="text.secondary" fontStyle="italic" textAlign="center">
                                No notifications yet.
                              </Typography>
                            }
                          />
                        </ListItem>
                      ) : (
                        notifications.map((n) => {
                          const isRider = n.notifiable_type?.includes('Rider');
                          return (
                            <ListItem
                              key={n.id}
                              component={ListItemButton}
                              divider
                              selected={!n.read_at}
                              onClick={() => handleItemClick(n)}
                              secondaryAction={
                                <Typography variant="caption" noWrap>
                                  {formatRelativeTime(n.created_at)}
                                </Typography>
                              }
                            >
                              <ListItemAvatar>
                                <Avatar
                                  sx={{
                                    color: isRider ? 'warning.main' : 'primary.main',
                                    bgcolor: isRider ? 'warning.lighter' : 'primary.lighter'
                                  }}
                                >
                                  {isRider ? <CarOutlined /> : <UserOutlined />}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={<Typography variant="h6">{n.title}</Typography>}
                                secondary={`${getNotifiableName(n)} — ${n.message}`}
                              />
                            </ListItem>
                          );
                        })
                      )}
                      <ListItemButton
                        sx={{ textAlign: 'center', py: `${12}px !important` }}
                        onClick={() => {
                          setOpen(false);
                          navigate('/notifications');
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="h6" sx={{ color: 'primary.main' }}>
                              View All
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </List>
                  )}
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
