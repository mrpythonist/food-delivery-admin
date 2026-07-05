import { useMemo, useState } from 'react';
import { Alert, Avatar, Box, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import useAbandonedCarts from 'hooks/useAbandonedCarts';
import { money, cartSubtotal, cartItemCount, formatRelativeTime } from 'utils/cartHelpers';
import CartItemsDialog from './CartItemsDialog';

export default function AbandonedCartsTable() {
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [viewingCart, setViewingCart] = useState(null);

  const params = useMemo(() => ({ page: paginationModel.page + 1, per_page: paginationModel.pageSize }), [paginationModel]);

  const { carts, totalRows, loading } = useAbandonedCarts(params);

  const columns = [
    {
      field: 'customer',
      headerName: 'Customer',
      flex: 1.2,
      minWidth: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ py: 0.5 }}>
          <Avatar sx={{ width: 36, height: 36 }}>{params.row.customer?.first_name?.[0] || <UserOutlined />}</Avatar>
          <Stack spacing={0}>
            <Typography fontWeight={600} variant="body2">
              {params.row.customer?.first_name} {params.row.customer?.last_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.customer?.phone || '-'}
            </Typography>
          </Stack>
        </Stack>
      )
    },
    {
      field: 'item_count',
      headerName: 'Items',
      width: 90,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      valueGetter: (value, row) => cartItemCount(row)
    },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      width: 130,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => <Typography fontWeight={700}>{money(cartSubtotal(params.row))}</Typography>
    },
    {
      field: 'updated_at',
      headerName: 'Last Activity',
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => <Chip size="small" variant="outlined" color="warning" label={formatRelativeTime(params.value)} />
    },
    {
      field: 'actions',
      headerName: '',
      width: 110,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="View Items">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setViewingCart(params.row);
              }}
            >
              <EyeOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Customer">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/customers/${params.row.customer_id}`);
              }}
            >
              <UserOutlined />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  return (
    <Box>
      <Alert severity="info" variant="outlined" sx={{ mb: 3 }}>
        Showing carts with items that haven't been updated in the last 24 hours or more.
      </Alert>

      <Box sx={{ height: 620 }}>
        <DataGrid
          rows={carts || []}
          columns={columns}
          loading={Boolean(loading)}
          disableRowSelectionOnClick
          disableColumnMenu
          paginationMode="server"
          rowCount={totalRows || 0}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50]}
          getRowHeight={() => 64}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { bgcolor: 'grey.50', fontWeight: 600 },
            '& .MuiDataGrid-row:hover': { bgcolor: 'action.hover' }
          }}
        />
      </Box>

      <CartItemsDialog open={Boolean(viewingCart)} cart={viewingCart} onClose={() => setViewingCart(null)} />
    </Box>
  );
}
