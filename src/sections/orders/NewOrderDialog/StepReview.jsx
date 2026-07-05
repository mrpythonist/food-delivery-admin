import { Box, Chip, Divider, Stack, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';

function money(v) {
  return `PKR ${Number(v || 0).toLocaleString()}`;
}

export default function StepReview({
  customerMode,
  selectedCustomer,
  newCustomer,
  addressMode,
  selectedAddressId,
  savedAddresses,
  newAddress,
  items,
  couponCode,
  paymentMethod,
  transactionId,
  paymentReceipt,
  notes,
  subtotal,
  estimatedDeliveryFee
}) {
  const customerName =
    customerMode === 'existing'
      ? `${selectedCustomer?.first_name || ''} ${selectedCustomer?.last_name || ''}`
      : `${newCustomer.first_name} ${newCustomer.last_name}`;
  const customerPhone = customerMode === 'existing' ? selectedCustomer?.phone : newCustomer.phone;

  const address = addressMode === 'existing' ? savedAddresses?.find((a) => a.id === selectedAddressId) : newAddress;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Customer
        </Typography>
        <Typography fontWeight={600}>{customerName}</Typography>
        <Typography variant="body2" color="text.secondary">
          {customerPhone}
        </Typography>
        {customerMode === 'new' && <Chip size="small" label="New Customer" color="info" sx={{ mt: 0.5 }} />}
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Delivery Address
        </Typography>
        <Typography fontWeight={600}>{address?.recipient_name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {address?.address_line_1}
          {address?.address_line_2 ? `, ${address.address_line_2}` : ''}, {address?.city} {address?.state} {address?.postal_code}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {address?.phone}
        </Typography>
        {addressMode === 'new' && <Chip size="small" label="New Address" color="info" sx={{ mt: 0.5 }} />}
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Items ({items.length})
        </Typography>
        <Table size="small">
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.variant.id}>
                <TableCell sx={{ border: 0, pl: 0 }}>
                  {item.product.name}{' '}
                  <Typography component="span" variant="caption" color="text.secondary">
                    ({item.variant.name})
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ border: 0 }}>
                  x{item.quantity}
                </TableCell>
                <TableCell align="right" sx={{ border: 0, pr: 0 }}>
                  {money(item.variant.price * item.quantity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Payment
        </Typography>
        <Typography variant="body2">
          Method: <strong>{paymentMethod.toUpperCase()}</strong>
        </Typography>
        {transactionId && <Typography variant="body2">Transaction ID: {transactionId}</Typography>}
        {paymentReceipt && <Typography variant="body2">Receipt: {paymentReceipt.name}</Typography>}
        {couponCode && <Typography variant="body2">Coupon: {couponCode}</Typography>}
        {notes && (
          <Typography variant="body2" color="text.secondary">
            Notes: {notes}
          </Typography>
        )}
      </Box>

      <Divider />

      <Stack direction="row" justifyContent="space-between">
        <Typography color="text.secondary">Subtotal</Typography>
        <Typography fontWeight={600}>{money(subtotal)}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography color="text.secondary">Est. Delivery Fee</Typography>
        <Typography fontWeight={600}>{money(estimatedDeliveryFee)}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6">Estimated Total</Typography>
        <Typography variant="h6" color="primary.main">
          {money(subtotal + Number(estimatedDeliveryFee))}
        </Typography>
      </Stack>
    </Stack>
  );
}
