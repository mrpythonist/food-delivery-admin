import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import useAuth from 'hooks/useAuth';

export default function GuestGuard({ children }) {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (authenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

GuestGuard.propTypes = {
  children: PropTypes.node
};
