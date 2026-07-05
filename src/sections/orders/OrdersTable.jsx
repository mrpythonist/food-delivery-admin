import { useMemo, useState, useCallback } from 'react';
import { Box, Chip, IconButton, Snackbar, Alert, Stack, Typography, Tooltip, Button } from '@mui/material';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import useOrders from 'hooks/useOrders';
import { getOrders } from 'api/orders';
import { downloadCsv } from 'utils/exportCsv';
import { statusColor, statusLabel, paymentColor, paymentLabel, money, formatDate } from 'utils/orderStatus';
import OrdersFilters from './OrdersFilters';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import NewOrderDialog from './NewOrderDialog';

const DEFAULT_FILTERS = {
  search: '',
  status: 'all',
  payment_status: 'all',
  date_from: '',
  date_to: ''
};

export default function OrdersTable() {
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  });
  const [sortModel, setSortModel] = useState([{ field: 'placed_at', sort: 'desc' }]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [exporting, setExporting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newOrderOpen, setNewOrderOpen] = useState(false);

  function handleOrderCreated() {
    setSnackbar({ open: true, message: 'Order created successfully', severity: 'success' });
    refresh();
  }

  const filterParams = useMemo(() => {
    const p = {};
    if (filters.search) p.search = filters.search;
    if (filters.status !== 'all') p.status = filters.status;
    if (filters.payment_status !== 'all') p.payment_status = filters.payment_status;
    if (filters.date_from) p.date_from = filters.date_from;
    if (filters.date_to) p.date_to = filters.date_to;
    return p;
  }, [filters]);

  const sortParams = useMemo(() => {
    if (!sortModel.length) return {};
    return {
      sort_by: sortModel[0].field,
      sort_order: sortModel[0].sort
    };
  }, [sortModel]);

  const params = useMemo(
    () => ({
      ...filterParams,
      ...sortParams,
      page: paginationModel.page + 1,
      per_page: paginationModel.pageSize
    }),
    [filterParams, sortParams, paginationModel]
  );

  const { orders, totalRows, loading, refresh } = useOrders(params);

  const handleFilterChange = useCallback((partial) => {
    setFilters((prev) => ({ ...prev, ...partial }));
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  const handleSortModelChange = useCallback((model) => {
    setSortModel(model);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  async function handleExport() {
    setExporting(true);
    try {
      const { data } = await getOrders({
        ...filterParams,
        ...sortParams,
        page: 1,
        per_page: 100000
      });
      console.log(data);
      const rows = data.data.map((o) => ({
        order_number: o.order_number,
        customer: `${o.customer?.first_name || ''} ${o.customer?.last_name || ''}`.trim(),
        phone: o.customer?.phone || '',
        items: o.items?.length || 0,
        subtotal: o.subtotal,
        delivery_fee: o.delivery_fee,
        discount: o.discount,
        total: o.total,
        payment_method: o.payment_method,
        payment_status: o.payment_status,
        status: o.status,
        placed_at: o.placed_at ? new Date(o.placed_at).toLocaleString() : '',
        delivered_at: o.delivered_at ? new Date(o.delivered_at).toLocaleString() : ''
      }));

      downloadCsv(`orders_export_${Date.now()}.csv`, rows, [
        { key: 'order_number', label: 'Order No' },
        { key: 'customer', label: 'Customer' },
        { key: 'phone', label: 'Phone' },
        { key: 'items', label: 'Items' },
        { key: 'subtotal', label: 'Subtotal' },
        { key: 'delivery_fee', label: 'Delivery Fee' },
        { key: 'discount', label: 'Discount' },
        { key: 'total', label: 'Total' },
        { key: 'payment_method', label: 'Payment Method' },
        { key: 'payment_status', label: 'Payment Status' },
        { key: 'status', label: 'Status' },
        { key: 'placed_at', label: 'Placed At' },
        { key: 'delivered_at', label: 'Delivered At' }
      ]);

      setSnackbar({ open: true, message: `Exported ${rows.length} orders`, severity: 'success' });
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: 'Export failed. Please try again.', severity: 'error' });
    } finally {
      setExporting(false);
    }
  }

  const columns = [
    {
      field: 'order_number',
      headerName: 'Order No',
      flex: 1.1,
      minWidth: 130,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Typography fontWeight={600} variant="body2">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'placed_at',
      headerName: 'Order Date',
      flex: 1,
      minWidth: 160,
      disableColumnMenu: true,
      renderCell: (params) => <Typography variant="body2">{formatDate(params.row.placed_at)}</Typography>
    },
    {
      field: 'customer',
      headerName: 'Customer',
      flex: 1.2,
      minWidth: 180,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const customer = params.row?.customer || {};
        return (
          <Stack direction="row" spacing={1.2} style={{ alignItems: 'center' }} sx={{ py: 0.5 }}>
            <Stack spacing={0}>
              <Typography variant="body2" fontWeight={500}>
                {`${customer.first_name || ''} ${customer.last_name || ''}`}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {customer.phone || '-'}
              </Typography>
            </Stack>
          </Stack>
        );
      }
    },
    {
      field: 'items',
      headerName: 'Items',
      width: 80,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      valueGetter: (params) => params.row?.items?.length ?? 0
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 130,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Typography fontWeight={700} variant="body2">
          {money(params.value)}
        </Typography>
      )
    },
    {
      field: 'payment_status',
      headerName: 'Payment',
      width: 120,
      disableColumnMenu: true,
      renderCell: (params) => <Chip size="small" color={paymentColor(params.value)} label={paymentLabel(params.value)} />
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 160,
      disableColumnMenu: true,
      renderCell: (params) => <Chip size="small" color={statusColor(params.value)} label={statusLabel(params.value)} />
    },
    {
      field: 'actions',
      headerName: 'View',
      width: 70,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Tooltip title="View details">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/orders/${params.row.id}`);
            }}
          >
            <EyeOutlined />
          </IconButton>
        </Tooltip>
      )
    }
  ];

  return (
    <Box>
      <Stack direction="row" style={{ justifyContent: 'flex-start' }} sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => setNewOrderOpen(true)}>
          New Order
        </Button>
      </Stack>
      <OrdersFilters
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
        onExport={handleExport}
        onRefresh={refresh}
        exporting={exporting}
      />
      <Box sx={{ height: 620 }}>
        <DataGrid
          rows={orders || []}
          columns={columns}
          loading={Boolean(loading)}
          disableRowSelectionOnClick
          disableColumnMenu
          paginationMode="server"
          rowCount={totalRows || 0}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50]}
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          getRowHeight={() => 64}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: 'grey.50',
              fontWeight: 600
            },
            '& .MuiDataGrid-row:hover': {
              bgcolor: 'action.hover',
              cursor: 'pointer'
            },
            '& .MuiTablePagination-select': {
              display: 'flex',
              alignItems: 'center'
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              marginBottom: 0
            }
          }}
          onRowClick={(params, event) => {
            if (event.target.closest('button')) return;
            navigate(`/orders/${params.row.id}`);
          }}
        />
      </Box>
      <NewOrderDialog open={newOrderOpen} onClose={() => setNewOrderOpen(false)} onCreated={handleOrderCreated} />
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
