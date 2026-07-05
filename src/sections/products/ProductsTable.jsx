import { useEffect, useMemo, useState, useCallback } from 'react';
import { Alert, Avatar, Box, Button, Chip, IconButton, Snackbar, Stack, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import AppstoreOutlined from '@ant-design/icons/AppstoreOutlined';
import useProducts from 'hooks/useProducts';
import { getCategories } from 'api/categories';
import { priceRange } from 'utils/productHelpers';
import { getStorageUrl } from 'utils/storageUrl';
import ProductsFilters from './ProductsFilters';
import ProductDialog from './ProductDialog';
import ManageVariantsDialog from './ManageVariantsDialog';
import DeleteProductDialog from './DeleteProductDialog';

const DEFAULT_FILTERS = {
  search: '',
  category_id: 'all',
  is_active: 'all',
  is_featured: 'all'
};

export default function ProductsTable() {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [categories, setCategories] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [variantsDialogProduct, setVariantsDialogProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  useEffect(() => {
    getCategories()
      .then(({ data }) => setCategories(data || []))
      .catch((err) => console.error(err));
  }, []);

  const params = useMemo(() => {
    const p = { page: paginationModel.page + 1, per_page: paginationModel.pageSize };
    if (filters.search) p.search = filters.search;
    if (filters.category_id !== 'all') p.category_id = filters.category_id;
    if (filters.is_active !== 'all') p.is_active = filters.is_active;
    if (filters.is_featured !== 'all') p.is_featured = filters.is_featured;
    return p;
  }, [filters, paginationModel]);

  const { products, totalRows, loading, refresh } = useProducts(params);

  const handleFilterChange = useCallback((partial) => {
    setFilters((prev) => ({ ...prev, ...partial }));
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  function handleAdd() {
    setEditingProduct(null);
    setProductDialogOpen(true);
  }

  function handleEdit(product) {
    setEditingProduct(product);
    setProductDialogOpen(true);
  }

  function handleSaved() {
    setSnackbar({
      open: true,
      message: editingProduct ? 'Product updated' : 'Product created',
      severity: 'success'
    });
    refresh();
  }

  function handleDeleted() {
    setSnackbar({ open: true, message: 'Product deleted', severity: 'success' });
    refresh();
  }

  const columns = [
    {
      field: 'image',
      headerName: '',
      width: 60,
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
      headerName: 'Product',
      flex: 1.3,
      minWidth: 180,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack spacing={0}>
          <Typography fontWeight={600} variant="body2">
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.slug}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 0.9,
      minWidth: 130,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (value, row) => row.category?.name || '-'
    },
    {
      field: 'variants',
      headerName: 'Variants',
      width: 110,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <Chip size="small" variant="outlined" label={`${params.row.variants?.length || 0}`} />
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 140,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (value, row) => priceRange(row.variants)
    },
    {
      field: 'is_active',
      headerName: 'Active',
      width: 90,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <Chip size="small" color={params.value ? 'success' : 'default'} label={params.value ? 'Yes' : 'No'} />
    },
    {
      field: 'is_featured',
      headerName: 'Featured',
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (params.value ? <Chip size="small" color="warning" label="Featured" /> : null)
    },
    {
      field: 'actions',
      headerName: '',
      width: 130,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Manage Variants">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setVariantsDialogProduct(params.row);
              }}
            >
              <AppstoreOutlined />
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
                setDeletingProduct(params.row);
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
      <Stack direction="row" style={{ justifyContent: 'flex-start' }} sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd}>
          Add Product
        </Button>
      </Stack>

      <ProductsFilters
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
        onRefresh={refresh}
        categories={categories}
      />

      <Box sx={{ height: 620 }}>
        <DataGrid
          rows={products || []}
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
            handleEdit(params.row);
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

      <ProductDialog
        open={productDialogOpen}
        product={editingProduct}
        categories={categories}
        onClose={() => setProductDialogOpen(false)}
        onSaved={handleSaved}
      />

      <ManageVariantsDialog
        open={Boolean(variantsDialogProduct)}
        product={variantsDialogProduct}
        onClose={() => setVariantsDialogProduct(null)}
        onChanged={refresh}
      />

      <DeleteProductDialog
        open={Boolean(deletingProduct)}
        product={deletingProduct}
        onClose={() => setDeletingProduct(null)}
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
