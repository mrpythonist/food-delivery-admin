import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Step, StepLabel, Stepper } from '@mui/material';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import { createCustomer } from 'api/customers';
import { createAddress } from 'api/addresses';
import { createOrder } from 'api/orders';
import { getSettings } from 'api/settings';
import { buildOrderFormData } from 'utils/buildOrderFormData';
import StepCustomer from './StepCustomer';
import StepAddress from './StepAddress';
import StepItems from './StepItems';
import StepPayment from './StepPayment';
import StepReview from './StepReview';

const STEPS = ['Customer', 'Address', 'Items', 'Payment', 'Review'];

const EMPTY_NEW_CUSTOMER = { first_name: '', last_name: '', email: '', phone: '' };
const EMPTY_NEW_ADDRESS = {
  label: '',
  recipient_name: '',
  phone: '',
  address_line_1: '',
  address_line_2: '',
  city: '',
  state: '',
  postal_code: '',
  is_default: false
};

export default function NewOrderDialog({ open, onClose, onCreated }) {
  const [activeStep, setActiveStep] = useState(0);

  const [customerMode, setCustomerMode] = useState('existing');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState(EMPTY_NEW_CUSTOMER);

  const [addressMode, setAddressMode] = useState('new');
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState(EMPTY_NEW_ADDRESS);

  const [items, setItems] = useState([]);

  const [couponCode, setCouponCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [transactionId, setTransactionId] = useState('');
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [notes, setNotes] = useState('');

  const [settings, setSettings] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const savedAddresses = selectedCustomer?.addresses || [];

  useEffect(() => {
    if (open) {
      getSettings()
        .then(({ data }) => setSettings(data))
        .catch((err) => console.error(err));
    }
  }, [open]);

  // Reset address selection whenever the customer selection changes
  useEffect(() => {
    if (customerMode === 'new') {
      setAddressMode('new');
      setSelectedAddressId(null);
    } else if (selectedCustomer) {
      const hasAddresses = (selectedCustomer.addresses || []).length > 0;
      setAddressMode(hasAddresses ? 'existing' : 'new');
      setSelectedAddressId(selectedCustomer.addresses?.find((a) => a.is_default)?.id || selectedCustomer.addresses?.[0]?.id || null);
    }
  }, [selectedCustomer, customerMode]);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.variant.price * i.quantity, 0), [items]);

  const estimatedDeliveryFee = useMemo(() => {
    if (!settings) return 0;
    return subtotal >= (settings.free_delivery_above ?? Infinity) ? 0 : settings.delivery_fee || 0;
  }, [settings, subtotal]);

  function resetState() {
    setActiveStep(0);
    setCustomerMode('existing');
    setSelectedCustomer(null);
    setNewCustomer(EMPTY_NEW_CUSTOMER);
    setAddressMode('new');
    setSelectedAddressId(null);
    setNewAddress(EMPTY_NEW_ADDRESS);
    setItems([]);
    setCouponCode('');
    setPaymentMethod('cod');
    setTransactionId('');
    setPaymentReceipt(null);
    setNotes('');
    setError('');
  }

  function handleClose() {
    if (submitting) return;
    resetState();
    onClose();
  }

  function isStepValid(step) {
    switch (step) {
      case 0:
        return customerMode === 'existing' ? Boolean(selectedCustomer) : Boolean(newCustomer.first_name && newCustomer.phone);
      case 1:
        return addressMode === 'existing'
          ? Boolean(selectedAddressId)
          : Boolean(newAddress.recipient_name && newAddress.phone && newAddress.address_line_1 && newAddress.city);
      case 2:
        return items.length > 0;
      case 3:
        return paymentMethod === 'cod' || Boolean(transactionId && paymentReceipt);
      default:
        return true;
    }
  }

  function handleNext() {
    setError('');
    if (!isStepValid(activeStep)) {
      setError('Please fill in all required fields before continuing.');
      return;
    }
    setActiveStep((s) => s + 1);
  }

  function handleBack() {
    setError('');
    setActiveStep((s) => s - 1);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError('');
    try {
      // 1. Resolve customer — create if this is a new one
      let customerId = selectedCustomer?.id;
      if (customerMode === 'new') {
        const { data } = await createCustomer(newCustomer);
        customerId = data.id;
      }

      // 2. Resolve address — create if this is a new one
      let addressId = selectedAddressId;
      if (addressMode === 'new') {
        const { data } = await createAddress({ ...newAddress, customer_id: customerId });
        addressId = data.id;
      }

      // 3. Build and submit the order
      const orderPayload = {
        customer_id: customerId,
        address_id: addressId,
        coupon_code: couponCode || undefined,
        payment_method: paymentMethod,
        transaction_id: transactionId || undefined,
        payment_receipt: paymentReceipt || undefined,
        notes: notes || undefined,
        items: items.map((i) => ({
          product_id: i.product.id,
          product_variant_id: i.variant.id,
          quantity: i.quantity
        }))
      };

      const needsMultipart = Boolean(paymentReceipt);
      const body = needsMultipart ? buildOrderFormData(orderPayload) : orderPayload;

      const { data: order } = await createOrder(body, { isMultipart: needsMultipart });

      onCreated?.(order);
      resetState();
      onClose();
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {}).flat()[0] ||
        'Failed to create order. Please check the details and try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        New Order
        <IconButton onClick={handleClose} disabled={submitting}>
          <CloseOutlined />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {activeStep === 0 && (
          <StepCustomer
            customerMode={customerMode}
            setCustomerMode={setCustomerMode}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
            newCustomer={newCustomer}
            setNewCustomer={setNewCustomer}
          />
        )}

        {activeStep === 1 && (
          <StepAddress
            savedAddresses={savedAddresses}
            addressMode={addressMode}
            setAddressMode={setAddressMode}
            selectedAddressId={selectedAddressId}
            setSelectedAddressId={setSelectedAddressId}
            newAddress={newAddress}
            setNewAddress={setNewAddress}
          />
        )}

        {activeStep === 2 && <StepItems items={items} setItems={setItems} />}

        {activeStep === 3 && (
          <StepPayment
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            transactionId={transactionId}
            setTransactionId={setTransactionId}
            paymentReceipt={paymentReceipt}
            setPaymentReceipt={setPaymentReceipt}
            notes={notes}
            setNotes={setNotes}
            subtotal={subtotal}
            estimatedDeliveryFee={estimatedDeliveryFee}
            freeDeliveryThreshold={settings?.free_delivery_above}
          />
        )}

        {activeStep === 4 && (
          <StepReview
            customerMode={customerMode}
            selectedCustomer={selectedCustomer}
            newCustomer={newCustomer}
            addressMode={addressMode}
            selectedAddressId={selectedAddressId}
            savedAddresses={savedAddresses}
            newAddress={newAddress}
            items={items}
            couponCode={couponCode}
            paymentMethod={paymentMethod}
            transactionId={transactionId}
            paymentReceipt={paymentReceipt}
            notes={notes}
            subtotal={subtotal}
            estimatedDeliveryFee={estimatedDeliveryFee}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button color="inherit" onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        {activeStep > 0 && (
          <Button onClick={handleBack} disabled={submitting}>
            Back
          </Button>
        )}
        {activeStep < STEPS.length - 1 ? (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button variant="contained" onClick={handleSubmit} loading={submitting}>
            Place Order
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
