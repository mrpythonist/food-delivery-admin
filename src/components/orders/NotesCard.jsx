import { Box, Stack, Typography } from '@mui/material';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';
import MainCard from 'components/MainCard';

export default function NotesCard({ notes }) {
  return (
    <MainCard title="Customer Notes">
      {notes ? (
        <Stack direction="row" spacing={1.5} style={{ alignItems: 'flex-start' }}>
          <FileTextOutlined style={{ fontSize: 16, marginTop: 3, color: '#8c8c8c' }} />
          <Typography>{notes}</Typography>
        </Stack>
      ) : (
        <Box sx={{ py: 1 }}>
          <Typography color="text.disabled" fontStyle="italic">
            No notes provided for this order.
          </Typography>
        </Box>
      )}
    </MainCard>
  );
}
