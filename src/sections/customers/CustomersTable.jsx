import { useMemo, useState, useCallback } from 'react';
import { Alert, Avatar, Box, Button, Chip, IconButton, Snackbar, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import useCustomers from 'hooks/useCustomers';
import CustomerDialog from './CustomerDialog';
import DeleteCustomerDialog from './DeleteCustomerDialog';

export default function CustomersTable() {
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deletingCustomer, setDeletingCustomer] = useState(null);

  const params = useMemo(() => {
    const p = { page: paginationModel.page + 1, per_page: paginationModel.pageSize };
    if (search) p.search = search;
    return p;
  }, [search, paginationModel]);

  const { customers, totalRows, loading, refresh } = useCustomers(params);

  // debounce search input before pushing to backend
  const handleSearchChange = useCallback((value) => {
    setSearchInput(value);
  }, []);

  useMemo(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  function handleAdd() {
    setEditingCustomer(null);
    setDialogOpen(true);
  }

  function handleEdit(customer) {
    setEditingCustomer(customer);
    setDialogOpen(true);
  }

  function handleSaved() {
    setSnackbar({
      open: true,
      message: editingCustomer ? 'Customer updated' : 'Customer created',
      severity: 'success'
    });
    refresh();
  }

  function handleDeleted() {
    setSnackbar({ open: true, message: 'Customer deleted', severity: 'success' });
    refresh();
  }

  const columns = [
    {
      field: 'name',
      headerName: 'Customer',
      flex: 1.2,
      minWidth: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row" spacing={1.5} style={{ alignItems: 'center' }} sx={{ py: 0.5 }}>
          <Avatar sx={{ width: 36, height: 36 }}>{params.row.first_name?.[0]}</Avatar>
          <Stack spacing={0}>
            <Typography fontWeight={600} variant="body2">
              {params.row.first_name} {params.row.last_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              #{params.row.id}
            </Typography>
          </Stack>
        </Stack>
      )
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 0.9,
      minWidth: 140,
      disableColumnMenu: true
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 180,
      disableColumnMenu: true,
      valueGetter: (value, row) => row.email || '-'
    },
    {
      field: 'is_active',
      headerName: 'Status',
      width: 100,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip size="small" color={params.value ? 'success' : 'default'} label={params.value ? 'Active' : 'Inactive'} />
      )
    },
    {
      field: 'created_at',
      headerName: 'Joined',
      width: 160,
      disableColumnMenu: true,
      valueGetter: (value, row) => (row.created_at ? new Date(row.created_at).toLocaleDateString() : '-')
    },
    {
      field: 'actions',
      headerName: '',
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/customers/${params.row.id}`);
              }}
            >
              <EyeOutlined />
            </IconButton>
          </Tooltip>
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
                setDeletingCustomer(params.row);
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
          placeholder="Search by name, email, or phone..."
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          sx={{ maxWidth: 340 }}
          slotProps={{
            input: {
              startAdornment: <SearchOutlined style={{ marginRight: 8, color: '#8c8c8c' }} />
            }
          }}
        />
        <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd}>
          Add Customer
        </Button>
      </Stack>

      <Box sx={{ height: 620 }}>
        <DataGrid
          rows={customers || []}
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
          onRowClick={(params, event) => {
            if (event.target.closest('button')) return;
            navigate(`/customers/${params.row.id}`);
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { bgcolor: 'grey.50', fontWeight: 600 },
            '& .MuiDataGrid-row:hover': { bgcolor: 'action.hover', cursor: 'pointer' },
            '& .MuiTablePagination-select': { display: 'flex', alignItems: 'center' },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { marginBottom: 0 }
          }}
        />
      </Box>

      <CustomerDialog open={dialogOpen} customer={editingCustomer} onClose={() => setDialogOpen(false)} onSaved={handleSaved} />

      <DeleteCustomerDialog
        open={Boolean(deletingCustomer)}
        customer={deletingCustomer}
        onClose={() => setDeletingCustomer(null)}
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
