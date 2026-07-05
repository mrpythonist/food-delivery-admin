import { useState } from 'react';
import { Box, Stack, Button, Divider, Typography } from '@mui/material';
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import PrinterOutlined from '@ant-design/icons/PrinterOutlined';
import MainCard from 'components/MainCard';
import { formatDate } from 'utils/orderStatus';
import { printInvoice } from 'utils/printInvoice';
import UpdateStatusDialog from './UpdateStatusDialog';
import CreditCardOutlined from '@ant-design/icons/CreditCardOutlined';
import UpdatePaymentDialog from './UpdatePaymentDialog';

export default function TimelineCard({ order, onUpdate }) {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const steps = [
    ['Order Placed', order.placed_at],
    ['Confirmed', order.confirmed_at],
    ['Preparing', order.prepared_at],
    ['Ready For Pickup', order.ready_for_pickup_at],
    ['Picked Up', order.picked_up_at],
    ['On The Way', order.on_the_way_at],
    ['Delivered', order.delivered_at],
    ['Cancelled', order.cancelled_at]
  ].filter(([label, value]) => label !== 'Cancelled' || value); // hide "Cancelled" row unless it happened

  return (
    <MainCard title="Order Timeline">
      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Stack direction="row" spacing={0} sx={{ minWidth: 'fit-content', px: 0.5 }}>
          {steps.map(([label, value], idx) => {
            const done = Boolean(value);
            const isLast = idx === steps.length - 1;
            return (
              <Stack key={label} style={{ alignItems: 'center' }} sx={{ minWidth: 140, position: 'relative' }}>
                {/* Connector line */}
                {!isLast && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 11,
                      left: '50%',
                      width: '100%',
                      height: 2,
                      bgcolor: done ? 'success.main' : 'grey.200',
                      zIndex: 0
                    }}
                  />
                )}

                {/* Step circle */}
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: done ? 'success.main' : 'grey.200',
                    color: done ? 'common.white' : 'grey.500',
                    flexShrink: 0,
                    zIndex: 1
                  }}
                >
                  {done && <CheckOutlined style={{ fontSize: 12 }} />}
                </Box>

                {/* Label + date */}
                <Stack style={{ alignItems: 'center' }} spacing={0.2} sx={{ mt: 1.2, px: 1, textAlign: 'center' }}>
                  <Typography variant="body2" fontWeight={600} color={done ? 'text.primary' : 'text.disabled'} noWrap>
                    {label}
                  </Typography>
                  <Typography variant="caption" color={done ? 'text.secondary' : 'text.disabled'} sx={{ whiteSpace: 'nowrap' }}>
                    {done ? formatDate(value) : 'Pending'}
                  </Typography>
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      </Box>
      <Divider sx={{ my: 2.5 }} />

      <Stack direction="row" spacing={1.5} style={{ flexWrap: 'wrap' }}>
        <Button variant="contained" size="small" startIcon={<EditOutlined />} onClick={() => setStatusDialogOpen(true)}>
          Update Status
        </Button>
        <Button
          variant="contained"
          size="small"
          color="inherit"
          startIcon={<CreditCardOutlined />}
          onClick={() => setPaymentDialogOpen(true)}
        >
          Update Payment
        </Button>
        <Button variant="outlined" size="small" color="inherit" startIcon={<PrinterOutlined />} onClick={() => printInvoice(order)}>
          Print Invoice
        </Button>
      </Stack>
      <UpdateStatusDialog open={statusDialogOpen} order={order} onClose={() => setStatusDialogOpen(false)} onUpdated={onUpdate} />
      <UpdatePaymentDialog open={paymentDialogOpen} order={order} onClose={() => setPaymentDialogOpen(false)} onUpdated={onUpdate} />
    </MainCard>
  );
}
