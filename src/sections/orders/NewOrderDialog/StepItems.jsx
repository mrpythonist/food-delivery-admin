import { useEffect, useState } from 'react';
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import { getProducts } from 'api/products';

function money(v) {
  return `PKR ${Number(v || 0).toLocaleString()}`;
}

export default function StepItems({ items, setItems }) {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!inputValue) {
      setOptions([]);
      return undefined;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await getProducts({ search: inputValue, is_active: true, per_page: 10 });
        setOptions(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    if (selectedProduct) {
      const def = selectedProduct.variants?.find((v) => v.is_default) || selectedProduct.variants?.[0];
      setSelectedVariantId(def?.id || '');
    } else {
      setSelectedVariantId('');
    }
  }, [selectedProduct]);

  function handleAddItem() {
    if (!selectedProduct || !selectedVariantId) return;
    const variant = selectedProduct.variants.find((v) => v.id === selectedVariantId);
    if (!variant) return;

    setItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.variant.id === variant.id);
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx] = { ...copy[existingIdx], quantity: copy[existingIdx].quantity + quantity };
        return copy;
      }
      return [...prev, { product: selectedProduct, variant, quantity }];
    });

    setSelectedProduct(null);
    setSelectedVariantId('');
    setQuantity(1);
    setInputValue('');
  }

  function handleRemove(variantId) {
    setItems((prev) => prev.filter((i) => i.variant.id !== variantId));
  }

  function handleQtyChange(variantId, qty) {
    setItems((prev) => prev.map((i) => (i.variant.id === variantId ? { ...i, quantity: Math.max(1, qty) } : i)));
  }

  const subtotal = items.reduce((sum, i) => sum + i.variant.price * i.quantity, 0);

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
        <Autocomplete
          sx={{ flex: 2, width: { xs: '100%', sm: 'auto' } }}
          options={options}
          loading={loading}
          value={selectedProduct}
          onChange={(e, val) => setSelectedProduct(val)}
          onInputChange={(e, val) => setInputValue(val)}
          getOptionLabel={(o) => o.name}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar src={option.image || undefined} variant="rounded" sx={{ width: 32, height: 32 }}>
                  {option.name[0]}
                </Avatar>
                <Stack>
                  <Typography variant="body2">{option.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.variants?.length || 0} variant(s)
                  </Typography>
                </Stack>
              </Stack>
            </li>
          )}
          renderInput={(params) => <TextField {...params} label="Search product" placeholder="Type product name..." />}
        />

        <TextField
          select
          sx={{ flex: 1.2, minWidth: 160, width: { xs: '100%', sm: 'auto' } }}
          label="Variant"
          value={selectedVariantId}
          disabled={!selectedProduct}
          onChange={(e) => setSelectedVariantId(e.target.value)}
        >
          {(selectedProduct?.variants || []).map((v) => (
            <MenuItem key={v.id} value={v.id}>
              {v.name} — {money(v.price)}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          type="number"
          label="Qty"
          sx={{ width: { xs: '100%', sm: 90 } }}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          slotProps={{ htmlInput: { min: 1 } }}
        />

        <Button
          variant="contained"
          startIcon={<PlusOutlined />}
          disabled={!selectedProduct || !selectedVariantId}
          onClick={handleAddItem}
          sx={{ height: 56, width: { xs: '100%', sm: 'auto' } }}
        >
          Add
        </Button>
      </Stack>

      <Divider />

      {items.length === 0 ? (
        <Typography color="text.disabled" fontStyle="italic" textAlign="center" sx={{ py: 3 }}>
          No items added yet. Search and add products above.
        </Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Variant</TableCell>
              <TableCell align="center">Qty</TableCell>
              <TableCell align="right">Unit Price</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell width={40} />
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.variant.id}>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>
                  <Chip size="small" label={item.variant.name} variant="outlined" />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    type="number"
                    size="small"
                    value={item.quantity}
                    onChange={(e) => handleQtyChange(item.variant.id, Number(e.target.value))}
                    slotProps={{ htmlInput: { min: 1, style: { textAlign: 'center', width: 50 } } }}
                  />
                </TableCell>
                <TableCell align="right">{money(item.variant.price)}</TableCell>
                <TableCell align="right">
                  <Typography fontWeight={600}>{money(item.variant.price * item.quantity)}</Typography>
                </TableCell>
                <TableCell>
                  <IconButton size="small" color="error" onClick={() => handleRemove(item.variant.id)}>
                    <DeleteOutlined />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {items.length > 0 && (
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body2" color="text.secondary">
            Subtotal
          </Typography>
          <Typography variant="h5" color="primary.main">
            {money(subtotal)}
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
