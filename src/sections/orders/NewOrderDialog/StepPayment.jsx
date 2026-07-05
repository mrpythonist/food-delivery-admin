import { Alert, Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import UploadOutlined from '@ant-design/icons/UploadOutlined';

function money(v) {
  return `PKR ${Number(v || 0).toLocaleString()}`;
}

export default function StepPayment({
  couponCode,
  setCouponCode,
  paymentMethod,
  setPaymentMethod,
  transactionId,
  setTransactionId,
  paymentReceipt,
  setPaymentReceipt,
  notes,
  setNotes,
  subtotal,
  estimatedDeliveryFee,
  freeDeliveryThreshold
}) {
  const needsProof = paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash';

  return (
    <Stack spacing={3}>
      <TextField
        fullWidth
        label="Coupon Code (optional)"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
        helperText="Will be validated when the order is placed"
      />

      <TextField select fullWidth label="Payment Method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
        <MenuItem value="cod">Cash on Delivery</MenuItem>
        <MenuItem value="easypaisa">EasyPaisa</MenuItem>
        <MenuItem value="jazzcash">JazzCash</MenuItem>
      </TextField>

      {needsProof && (
        <Stack spacing={2}>
          <TextField fullWidth required label="Transaction ID" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
          <Button component="label" variant="outlined" color="inherit" startIcon={<UploadOutlined />} sx={{ alignSelf: 'flex-start' }}>
            {paymentReceipt ? paymentReceipt.name : 'Upload Payment Receipt'}
            <input type="file" hidden accept="image/*" onChange={(e) => setPaymentReceipt(e.target.files?.[0] || null)} />
          </Button>
          {!paymentReceipt && (
            <Alert severity="warning" variant="outlined">
              A receipt image is required for {paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'} payments.
            </Alert>
          )}
        </Stack>
      )}

      <TextField fullWidth multiline rows={3} label="Order Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />

      <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1.5 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Subtotal
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {money(subtotal)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Estimated Delivery Fee
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {money(estimatedDeliveryFee)}
          </Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {freeDeliveryThreshold
            ? `Free delivery on orders above ${money(freeDeliveryThreshold)}. Final fee and any coupon discount are calculated by the server at checkout.`
            : 'Final fee and any coupon discount are calculated by the server at checkout.'}
        </Typography>
      </Box>
    </Stack>
  );
}
