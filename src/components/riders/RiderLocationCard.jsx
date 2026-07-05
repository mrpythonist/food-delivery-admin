import { useState } from 'react';
import { Alert, Button, Stack, Typography } from '@mui/material';
import ReloadOutlined from '@ant-design/icons/ReloadOutlined';
import EnvironmentOutlined from '@ant-design/icons/EnvironmentOutlined';
import MainCard from 'components/MainCard';
import { getRiderLocation } from 'api/riders';

export default function RiderLocationCard({ riderId }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRefresh() {
    setLoading(true);
    setError('');
    try {
      const { data } = await getRiderLocation(riderId);
      setLocation(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setLocation(null);
        setError('Location not available for this rider yet.');
      } else {
        console.error(err);
        setError('Failed to fetch location.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainCard
      title="Live Location"
      secondary={
        <Button size="small" variant="outlined" color="inherit" startIcon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
          Refresh Location
        </Button>
      }
    >
      {error && (
        <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {location ? (
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <EnvironmentOutlined style={{ color: '#8c8c8c' }} />
            <Typography>
              Lat: {location.latitude}, Lng: {location.longitude}
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Last updated: {new Date(location.updated_at).toLocaleString()}
          </Typography>
        </Stack>
      ) : (
        !error && (
          <Typography color="text.disabled" fontStyle="italic">
            Click "Refresh Location" to fetch the rider's latest position.
          </Typography>
        )
      )}
    </MainCard>
  );
}
