import { useEffect, useMemo, useState, useCallback } from 'react';
import { Alert, Box, Button, Chip, IconButton, Snackbar, Stack, Switch, TextField, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import { getCoupons, updateCoupon } from 'api/coupons';
import { isExpired, formatValue, formatMinOrder } from 'utils/couponHelpers';
import CouponDialog from './CouponDialog';
import DeleteCouponDialog from './DeleteCouponDialog';

export default function CouponsTable() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toggling, setToggling] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deletingCoupon, setDeletingCoupon] = useState(null);

  const loadCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getCoupons();
      setCoupons(data || []);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to load coupons.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const filteredCoupons = useMemo(() => {
    if (!search.trim()) return coupons;
    const q = search.trim().toLowerCase();
    return coupons.filter((c) => c.code?.toLowerCase().includes(q));
  }, [coupons, search]);

  async function handleToggleActive(coupon) {
    setToggling(coupon.id);
    try {
      await updateCoupon(coupon.id, {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minimum_order: coupon.minimum_order,
        expires_at: coupon.expires_at,
        is_active: !coupon.is_active
      });
      setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? { ...c, is_active: !c.is_active } : c)));
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to update status.', severity: 'error' });
    } finally {
      setToggling(null);
    }
  }

  function handleAdd() {
    setEditingCoupon(null);
    setDialogOpen(true);
  }

  function handleEdit(coupon) {
    setEditingCoupon(coupon);
    setDialogOpen(true);
  }

  function handleSaved() {
    setSnackbar({ open: true, message: editingCoupon ? 'Coupon updated' : 'Coupon created', severity: 'success' });
    loadCoupons();
  }

  function handleDeleted() {
    setSnackbar({ open: true, message: 'Coupon deleted', severity: 'success' });
    loadCoupons();
  }

  const columns = [
    {
      field: 'code',
      headerName: 'Code',
      flex: 1,
      minWidth: 140,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Typography fontWeight={700} variant="body2">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'value',
      headerName: 'Discount',
      width: 120,
      disableColumnMenu: true,
      valueGetter: (value, row) => formatValue(row)
    },
    {
      field: 'minimum_order',
      headerName: 'Min. Order',
      flex: 1,
      minWidth: 130,
      disableColumnMenu: true,
      valueGetter: (value, row) => formatMinOrder(row.minimum_order)
    },
    {
      field: 'expires_at',
      headerName: 'Expires',
      width: 160,
      disableColumnMenu: true,
      renderCell: (params) => {
        if (!params.value) {
          return (
            <Typography variant="body2" color="text.secondary">
              Never
            </Typography>
          );
        }
        const expired = isExpired(params.row);
        return (
          <Stack spacing={0.3}>
            <Typography variant="body2" color={expired ? 'error.main' : 'text.primary'}>
              {new Date(params.value).toLocaleDateString()}
            </Typography>
            {expired && <Chip size="small" color="error" label="Expired" sx={{ width: 'fit-content' }} />}
          </Stack>
        );
      }
    },
    {
      field: 'is_active',
      headerName: 'Active',
      width: 100,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Switch
          size="small"
          checked={Boolean(params.value)}
          disabled={toggling === params.row.id}
          onChange={(e) => {
            e.stopPropagation();
            handleToggleActive(params.row);
          }}
        />
      )
    },
    {
      field: 'actions',
      headerName: '',
      width: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(params.row);
              }}
            >
              <EditOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                setDeletingCoupon(params.row);
              }}
            >
              <DeleteOutlined />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        style={{ justifyContent: 'space-between', alignItems: 'center' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <TextField
          size="small"
          placeholder="Search by coupon code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ maxWidth: 320 }}
          slotProps={{
            input: {
              startAdornment: <SearchOutlined style={{ marginRight: 8, color: '#8c8c8c' }} />
            }
          }}
        />
        <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd}>
          Add Coupon
        </Button>
      </Stack>

      <Box sx={{ height: 560 }}>
        <DataGrid
          rows={filteredCoupons}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          disableColumnMenu
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          getRowHeight={() => 64}
          onRowClick={(params, event) => {
            if (event.target.closest('button') || event.target.closest('.MuiSwitch-root')) return;
            handleEdit(params.row);
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { bgcolor: 'grey.50', fontWeight: 600 },
            '& .MuiDataGrid-row:hover': { bgcolor: 'action.hover', cursor: 'pointer' }
          }}
        />
      </Box>

      <CouponDialog open={dialogOpen} coupon={editingCoupon} onClose={() => setDialogOpen(false)} onSaved={handleSaved} />

      <DeleteCouponDialog
        open={Boolean(deletingCoupon)}
        coupon={deletingCoupon}
        onClose={() => setDeletingCoupon(null)}
        onDeleted={handleDeleted}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
