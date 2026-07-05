import { useEffect, useMemo, useState, useCallback } from 'react';
import { Alert, Avatar, Box, Button, IconButton, Snackbar, Stack, Switch, TextField, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import { getCategories, updateCategory } from 'api/categories';
import CategoryDialog from './CategoryDialog';
import DeleteCategoryDialog from './DeleteCategoryDialog';
import { getStorageUrl } from 'utils/storageUrl';

export default function CategoriesTable() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toggling, setToggling] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to load categories.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.trim().toLowerCase();
    return categories.filter((c) => c.name?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q));
  }, [categories, search]);

  async function handleToggleActive(category) {
    setToggling(category.id);
    try {
      await updateCategory(category.id, {
        name: category.name,
        description: category.description,
        image: category.image,
        sort_order: category.sort_order ?? 0,
        is_active: !category.is_active
      });
      setCategories((prev) => prev.map((c) => (c.id === category.id ? { ...c, is_active: !c.is_active } : c)));
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to update status.', severity: 'error' });
    } finally {
      setToggling(null);
    }
  }

  function handleAdd() {
    setEditingCategory(null);
    setDialogOpen(true);
  }

  function handleEdit(category) {
    setEditingCategory(category);
    setDialogOpen(true);
  }

  function handleSaved() {
    setSnackbar({
      open: true,
      message: editingCategory ? 'Category updated' : 'Category created',
      severity: 'success'
    });
    loadCategories();
  }

  function handleDeleted() {
    setSnackbar({ open: true, message: 'Category deleted', severity: 'success' });
    loadCategories();
  }

  const columns = [
    {
      field: 'image',
      headerName: '',
      width: 64,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Avatar src={getStorageUrl(params.value)} variant="rounded" sx={{ width: 36, height: 36 }}>
          {params.row.name?.[0]}
        </Avatar>
      )
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 160,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Typography fontWeight={600} variant="body2">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'slug',
      headerName: 'Slug',
      flex: 1,
      minWidth: 140,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1.5,
      minWidth: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {params.value || '-'}
        </Typography>
      )
    },
    {
      field: 'is_active',
      headerName: 'Active',
      width: 100,
      sortable: false,
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
                setDeletingCategory(params.row);
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
          placeholder="Search categories..."
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
          Add Category
        </Button>
      </Stack>

      <Box sx={{ height: 560 }}>
        <DataGrid
          rows={filteredCategories}
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
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: 'grey.50',
              fontWeight: 600
            },
            '& .MuiDataGrid-row:hover': {
              bgcolor: 'action.hover',
              cursor: 'pointer'
            }
          }}
        />
      </Box>

      <CategoryDialog open={dialogOpen} category={editingCategory} onClose={() => setDialogOpen(false)} onSaved={handleSaved} />

      <DeleteCategoryDialog
        open={Boolean(deletingCategory)}
        category={deletingCategory}
        onClose={() => setDeletingCategory(null)}
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
