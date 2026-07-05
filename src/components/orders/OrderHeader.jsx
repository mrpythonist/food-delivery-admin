import { Box, Chip, Divider, Stack, Typography, Table, TableBody, TableCell, TableRow } from '@mui/material';
import MainCard from 'components/MainCard';
import { statusColor, statusLabel, paymentColor, paymentLabel, money } from 'utils/orderStatus';

export default function OrderHeader({ order }) {
  const rows = [
    ['Order Number', order.order_number],
    ['Status', <Chip key="s" size="small" color={statusColor(order.status)} label={statusLabel(order.status)} />],
    ['Payment', <Chip key="p" size="small" color={paymentColor(order.payment_status)} label={paymentLabel(order.payment_status)} />],
    ['Payment Method', order.payment_method?.toUpperCase()],
    ['Transaction ID', order.transaction_id || '-'],
    ['Receipt', order.payment_receipt || '-'],
    ['Coupon', order.coupon_code || '-']
  ];

  return (
    <MainCard>
      <Stack direction={{ xs: 'column', md: 'row' }} style={{ justifyContent: 'space-between' }} spacing={3}>
        {/* Left */}
        <Box>
          <Stack direction="row" spacing={1.5} style={{ alignItems: 'center' }} sx={{ mb: 0.5 }}>
            <Typography variant="h3">{order.order_number}</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {order.customer.first_name} {order.customer.last_name}
          </Typography>
          <Chip variant="outlined" label={order.payment_method?.toUpperCase()} />
        </Box>

        {/* Right */}
        <Stack spacing={1.5} style={{ alignItems: 'flex-end' }}>
          <Box style={{ textAlign: 'right' }}>
            <Typography variant="h4" color="primary.main">
              {money(order.total)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Stack>
      </Stack>

      <Divider sx={{ my: 2.5 }} />
      <Table size="small">
        <TableBody>
          {rows.map(([label, value]) => (
            <TableRow key={label}>
              <TableCell width="40%" sx={{ color: 'text.secondary', border: 0 }}>
                {label}
              </TableCell>
              <TableCell sx={{ border: 0, fontWeight: 500 }}>{value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </MainCard>
  );
}
