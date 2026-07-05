import { Skeleton, Stack, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import MainCard from 'components/MainCard';
import { statusLabel } from 'utils/orderStatus';

const STATUS_COLORS = {
  pending: '#faad14',
  confirmed: '#1890ff',
  preparing: '#722ed1',
  ready_for_pickup: '#722ed1',
  picked_up: '#13c2c2',
  on_the_way: '#2f54eb',
  delivered: '#52c41a',
  cancelled: '#f5222d'
};

export default function OrdersByStatusChart({ data, loading }) {
  const chartData = (data || []).map((item, idx) => ({
    id: idx,
    value: item.total,
    label: statusLabel(item.status),
    color: STATUS_COLORS[item.status] || '#8c8c8c'
  }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <MainCard title="Orders by Status">
      {loading ? (
        <Skeleton variant="circular" width={220} height={220} sx={{ mx: 'auto' }} />
      ) : total === 0 ? (
        <Typography color="text.disabled" fontStyle="italic" textAlign="center" sx={{ py: 6 }}>
          No orders in this date range.
        </Typography>
      ) : (
        <Stack style={{ alignItems: 'center' }}>
          <PieChart
            series={[
              {
                data: chartData,
                innerRadius: 50,
                outerRadius: 100,
                paddingAngle: 2,
                cornerRadius: 4,
                highlightScope: { fade: 'global', highlight: 'item' }
              }
            ]}
            height={280}
            slotProps={{ legend: { direction: 'column', position: { vertical: 'middle', horizontal: 'right' } } }}
          />
        </Stack>
      )}
    </MainCard>
  );
}
