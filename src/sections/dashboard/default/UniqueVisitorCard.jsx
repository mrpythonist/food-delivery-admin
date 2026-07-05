import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import IncomeAreaChart from './IncomeAreaChart';

export default function UniqueVisitorCard({ data = [] }) {
  return (
    <>
      <Grid container style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Grid>
          <Typography variant="h5">Monthly Sale Overview</Typography>
        </Grid>
      </Grid>

      <MainCard content={false} sx={{ mt: 1.5 }}>
        <Box sx={{ pt: 1, pr: 2 }}>
          <IncomeAreaChart data={data} />
        </Box>
      </MainCard>
    </>
  );
}

UniqueVisitorCard.propTypes = {
  data: PropTypes.array
};
