import { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  TextField
} from '@mui/material';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import UploadOutlined from '@ant-design/icons/UploadOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import { createCategory, updateCategory } from 'api/categories';
import { uploadFile } from 'api/upload';
import { getStorageUrl } from 'utils/storageUrl';

const EMPTY_FORM = {
  name: '',
  description: '',
  image: '',
  is_active: true
};

export default function CategoryDialog({ open, category, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEdit = Boolean(category);

  useEffect(() => {
    if (open) {
      if (category) {
        setForm({
          name: category.name || '',
          description: category.description || '',
          image: category.image || '',
          is_active: Boolean(category.is_active)
        });
        setImagePreview(getStorageUrl(category.image));
      } else {
        setForm(EMPTY_FORM);
        setImagePreview('');
      }
      setError('');
    }
  }, [open, category]);

  async function handleImageSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    setError('');
    try {
      const { data } = await uploadFile(file);
      setForm((p) => ({ ...p, image: data.path }));
      setImagePreview(getStorageUrl(data.path)); // use the relative path consistently, same helper as everywhere else
    } catch (err) {
      console.error(err);
      setError('Image upload failed. Please try again.');
      setImagePreview(getStorageUrl(form.image));
    } finally {
      setUploading(false);
    }
  }

  function handleRemoveImage() {
    setForm((p) => ({ ...p, image: '' }));
    setImagePreview('');
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setError('Category name is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        description: form.description || null,
        image: form.image || null,
        is_active: form.is_active,
        sort_order: category?.sort_order ?? 0
      };

      if (isEdit) {
        await updateCategory(category.id, payload);
      } else {
        await createCategory(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {}).flat()[0] ||
        'Failed to save category. Please try again.';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isEdit ? 'Edit Category' : 'Add Category'}
        <IconButton onClick={onClose} disabled={saving}>
          <CloseOutlined />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ mt: 0.5 }}>
          {error && (
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={imagePreview || undefined} variant="rounded" sx={{ width: 64, height: 64, bgcolor: 'grey.100' }}>
              {form.name?.[0] || '?'}
            </Avatar>
            <Stack spacing={1}>
              <Button
                component="label"
                size="small"
                variant="outlined"
                color="inherit"
                startIcon={uploading ? <CircularProgress size={14} /> : <UploadOutlined />}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" hidden accept="image/*" onChange={handleImageSelect} />
              </Button>
              {imagePreview && (
                <Button size="small" color="error" startIcon={<DeleteOutlined />} onClick={handleRemoveImage} disabled={uploading}>
                  Remove
                </Button>
              )}
            </Stack>
          </Stack>

          <TextField
            fullWidth
            required
            label="Category Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          />

          <FormControlLabel
            control={<Checkbox checked={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} />}
            label="Active"
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button color="inherit" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} loading={saving} disabled={uploading}>
          {isEdit ? 'Save Changes' : 'Create Category'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
