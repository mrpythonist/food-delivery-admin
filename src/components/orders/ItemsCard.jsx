import { Divider, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

import MainCard from 'components/MainCard';

function money(value) {
  return `PKR ${Number(value || 0).toLocaleString()}`;
}

export default function ItemsCard({ order }) {
  return (
    <MainCard title={`Order Items (${order.items.length})`}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width="30%">Product</TableCell>

            <TableCell width="22%">Variant</TableCell>

            <TableCell align="center">Qty</TableCell>

            <TableCell align="right">Unit Price</TableCell>

            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {order.items.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell>
                <Stack direction="row" spacing={2} style={{ alignItems: 'center' }}>
                  <Stack spacing={0.4}>
                    <Typography fontWeight={600}>{item.product_name}</Typography>
                  </Stack>
                </Stack>
              </TableCell>

              <TableCell>
                <Stack spacing={0.5}>
                  <Typography fontWeight={500}>{item.variant_name}</Typography>
                </Stack>
              </TableCell>

              <TableCell align="center">{item.quantity}</TableCell>

              <TableCell align="right">{money(item.unit_price)}</TableCell>

              <TableCell align="right">
                <Typography fontWeight={700}>{money(item.total_price)}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Divider sx={{ my: 4 }} />

      <Stack spacing={1.5} style={{ alignItems: 'flex-end' }}>
        <Stack direction="row" spacing={8} width={280} style={{ justifyContent: 'space-between' }}>
          <Typography color="text.secondary">Subtotal</Typography>

          <Typography fontWeight={600}>{money(order.subtotal)}</Typography>
        </Stack>

        <Stack direction="row" spacing={8} width={280} style={{ justifyContent: 'space-between' }}>
          <Typography color="text.secondary">Delivery Fee</Typography>

          <Typography fontWeight={600}>{money(order.delivery_fee)}</Typography>
        </Stack>

        <Stack direction="row" spacing={8} width={280} style={{ justifyContent: 'space-between' }}>
          <Typography color="text.secondary">Discount</Typography>

          <Typography fontWeight={600}>{money(order.discount)}</Typography>
        </Stack>

        <Divider
          sx={{
            width: 280,
            my: 1
          }}
        />

        <Stack direction="row" spacing={8} width={280} style={{ justifyContent: 'space-between' }}>
          <Typography variant="h5">Grand Total</Typography>

          <Typography variant="h4" color="primary">
            {money(order.total)}
          </Typography>
        </Stack>
      </Stack>
    </MainCard>
  );
}
