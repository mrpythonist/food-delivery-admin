import { useNavigate } from 'react-router-dom';
import { Chip, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { statusColor, statusLabel, money, formatDate } from 'utils/orderStatus';

export default function RiderOrdersCard({ orders }) {
  const navigate = useNavigate();

  return (
    <MainCard title={`Assigned Orders (${orders?.length || 0})`}>
      {!orders || orders.length === 0 ? (
        <Typography color="text.disabled" fontStyle="italic" textAlign="center" sx={{ py: 3 }}>
          No orders assigned to this rider yet.
        </Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Order No</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Placed At</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/orders/${order.id}`)}>
                <TableCell>
                  <Typography fontWeight={600} variant="body2">
                    {order.order_number}
                  </Typography>
                </TableCell>
                <TableCell>
                  {order.customer?.first_name} {order.customer?.last_name}
                </TableCell>
                <TableCell>{formatDate(order.placed_at)}</TableCell>
                <TableCell align="right">{money(order.total)}</TableCell>
                <TableCell>
                  <Chip size="small" color={statusColor(order.status)} label={statusLabel(order.status)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </MainCard>
  );
}
