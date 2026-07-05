import { Checkbox, FormControlLabel, Stack, TextField, Typography } from '@mui/material';
import { DAYS } from 'utils/openingHours';

export default function OpeningHoursEditor({ hours, onChange }) {
  function handleDayChange(dayKey, field, value) {
    onChange({
      ...hours,
      [dayKey]: { ...hours[dayKey], [field]: value }
    });
  }

  return (
    <Stack spacing={1.5}>
      {DAYS.map((day) => {
        const dayHours = hours[day.key] || { open: '09:00', close: '23:00', closed: false };
        return (
          <Stack
            key={day.key}
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            style={{ alignItems: 'center' }}
            sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}
          >
            <Typography sx={{ width: 110, fontWeight: 500 }}>{day.label}</Typography>

            <FormControlLabel
              control={
                <Checkbox size="small" checked={dayHours.closed} onChange={(e) => handleDayChange(day.key, 'closed', e.target.checked)} />
              }
              label="Closed"
              sx={{ width: 100 }}
            />

            <TextField
              size="small"
              type="time"
              label="Opens"
              value={dayHours.open}
              disabled={dayHours.closed}
              onChange={(e) => handleDayChange(day.key, 'open', e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ width: 150 }}
            />

            <TextField
              size="small"
              type="time"
              label="Closes"
              value={dayHours.close}
              disabled={dayHours.closed}
              onChange={(e) => handleDayChange(day.key, 'close', e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ width: 150 }}
            />
          </Stack>
        );
      })}
    </Stack>
  );
}
