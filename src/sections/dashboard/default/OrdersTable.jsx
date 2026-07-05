import PropTypes from 'prop-types';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { NumericFormat } from 'react-number-format';
import { formatDate } from 'utils/orderStatus';
import Dot from 'components/@extended/Dot';
const headCells = [
  {
    id: 'order_number',
    align: 'left',
    disablePadding: false,
    label: 'Order No.'
  },
  {
    id: 'placed_at',
    align: 'left',
    disablePadding: false,
    label: 'Placed At.'
  },
  {
    id: 'customer',
    align: 'left',
    disablePadding: false,
    label: 'Customer'
  },
  {
    id: 'items',
    align: 'center',
    disablePadding: false,
    label: 'Items'
  },
  {
    id: 'status',
    align: 'left',
    disablePadding: false,
    label: 'Status'
  },
  {
    id: 'total',
    align: 'right',
    disablePadding: false,
    label: 'Total'
  }
];
function OrderTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} padding={headCell.disablePadding ? 'none' : 'normal'}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
function OrderStatus({ status }) {
  let color = 'warning';

  switch (status) {
    case 'pending':
      color = 'warning';
      break;

    case 'confirmed':
      color = 'info';
      break;

    case 'preparing':
      color = 'primary';
      break;

    case 'out_for_delivery':
      color = 'secondary';
      break;

    case 'delivered':
      color = 'success';
      break;

    case 'cancelled':
      color = 'error';
      break;
  }
  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
      <Dot color={color} />
      <Typography style={{ textTransform: 'capitalize' }}>{status.replaceAll('_', ' ')}</Typography>
    </Stack>
  );
}
export default function OrdersTable({ orders = [] }) {
  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <OrderTableHead />
          <TableBody>
            {orders.map((row, index) => {
              return (
                <TableRow hover key={row.order_number} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Link sx={{ color: 'secondary.main' }}>{row.order_number}</Link>
                  </TableCell>
                  <TableCell>{formatDate(row.placed_at)}</TableCell>
                  <TableCell>{row.customer}</TableCell>
                  <TableCell align="center">{row.items}</TableCell>
                  <TableCell>
                    <OrderStatus status={row.status} />
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormat value={row.total} displayType="text" thousandSeparator prefix="₨ " />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
OrderTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };
OrderStatus.propTypes = { status: PropTypes.number };
OrdersTable.propTypes = {
  orders: PropTypes.array
};
