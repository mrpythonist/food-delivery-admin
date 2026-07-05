import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import { money, cartSubtotal } from 'utils/cartHelpers';
import { getStorageUrl } from 'utils/storageUrl';

export default function CartItemsDialog({ open, cart, onClose }) {
  if (!cart) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Cart Items — {cart.customer?.first_name} {cart.customer?.last_name}
        <IconButton onClick={onClose}>
          <CloseOutlined />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Variant</TableCell>
              <TableCell align="center">Qty</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(cart.items || []).map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar src={getStorageUrl(item.product?.image)} variant="rounded" sx={{ width: 32, height: 32 }}>
                      {item.product?.name?.[0]}
                    </Avatar>
                    <Typography variant="body2">{item.product?.name || `#${item.product_id}`}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{item.variant?.name || '-'}</TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="right">
                  <Typography fontWeight={600}>{money(item.total_price)}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Stack direction="row" justifyContent="space-between" sx={{ mt: 2, px: 1 }}>
          <Typography fontWeight={600}>Subtotal</Typography>
          <Typography fontWeight={700} color="primary.main">
            {money(cartSubtotal(cart))}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
