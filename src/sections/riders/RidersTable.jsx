import { useMemo, useState, useEffect } from 'react';
import { Alert, Avatar, Box, Button, IconButton, Snackbar, Stack, Switch, TextField, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import useRiders from 'hooks/useRiders';
import { updateRider } from 'api/riders';
import RiderDialog from './RiderDialog';
import DeleteRiderDialog from './DeleteRiderDialog';

export default function RidersTable() {
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [toggling, setToggling] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRider, setEditingRider] = useState(null);
  const [deletingRider, setDeletingRider] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const params = useMemo(() => {
    const p = { page: paginationModel.page + 1, per_page: paginationModel.pageSize };
    if (search) p.search = search;
    return p;
  }, [search, paginationModel]);

  const { riders, totalRows, loading, refresh } = useRiders(params);

  async function handleToggle(rider, field) {
    setToggling(`${rider.id}-${field}`);
    try {
      await updateRider(rider.id, {
        name: rider.name,
        phone: rider.phone,
        is_online: field === 'is_online' ? !rider.is_online : rider.is_online,
        is_available: field === 'is_available' ? !rider.is_available : rider.is_available
      });
      refresh();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to update rider status.', severity: 'error' });
    } finally {
      setToggling(null);
    }
  }

  function handleAdd() {
    setEditingRider(null);
    setDialogOpen(true);
  }

  function handleEdit(rider) {
    setEditingRider(rider);
    setDialogOpen(true);
  }

  function handleSaved() {
    setSnackbar({ open: true, message: editingRider ? 'Rider updated' : 'Rider created', severity: 'success' });
    refresh();
  }

  function handleDeleted() {
    setSnackbar({ open: true, message: 'Rider deleted', severity: 'success' });
    refresh();
  }

  const columns = [
    {
      field: 'name',
      headerName: 'Rider',
      flex: 1.2,
      minWidth: 200,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row" spacing={1.5} style={{ alignItems: 'center' }} sx={{ py: 0.5 }}>
          <Avatar sx={{ width: 36, height: 36 }}>{params.row.name?.[0]}</Avatar>
          <Stack spacing={0}>
            <Typography fontWeight={600} variant="body2">
              {params.row.name}
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
      field: 'is_online',
      headerName: 'Online',
      width: 100,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Switch
          size="small"
          checked={Boolean(params.value)}
          disabled={toggling === `${params.row.id}-is_online`}
          onChange={(e) => {
            e.stopPropagation();
            handleToggle(params.row, 'is_online');
          }}
        />
      )
    },
    {
      field: 'is_available',
      headerName: 'Available',
      width: 110,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Switch
          size="small"
          checked={Boolean(params.value)}
          disabled={toggling === `${params.row.id}-is_available`}
          onChange={(e) => {
            e.stopPropagation();
            handleToggle(params.row, 'is_available');
          }}
        />
      )
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
                navigate(`/riders/${params.row.id}`);
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
                setDeletingRider(params.row);
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
          placeholder="Search by name or phone..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          sx={{ maxWidth: 320 }}
          slotProps={{
            input: {
              startAdornment: <SearchOutlined style={{ marginRight: 8, color: '#8c8c8c' }} />
            }
          }}
        />
        <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd}>
          Add Rider
        </Button>
      </Stack>

      <Box sx={{ height: 620 }}>
        <DataGrid
          rows={riders || []}
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
            if (event.target.closest('button') || event.target.closest('.MuiSwitch-root')) return;
            navigate(`/riders/${params.row.id}`);
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

      <RiderDialog open={dialogOpen} rider={editingRider} onClose={() => setDialogOpen(false)} onSaved={handleSaved} />

      <DeleteRiderDialog
        open={Boolean(deletingRider)}
        rider={deletingRider}
        onClose={() => setDeletingRider(null)}
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
