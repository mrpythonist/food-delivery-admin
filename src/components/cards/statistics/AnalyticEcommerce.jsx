import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
export default function AnalyticEcommerce({ color = 'primary', title, count }) {
  return (
    <MainCard contentSX={{ p: 2.25 }}>
      <Stack sx={{ gap: 0.5 }}>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          {title}
        </Typography>
        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <Typography variant="h4" sx={{ color: 'inherit' }}>
            {count}
          </Typography>
        </Stack>
      </Stack>
    </MainCard>
  );
}
AnalyticEcommerce.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.string
};
