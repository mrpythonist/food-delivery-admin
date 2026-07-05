import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';

import { axisClasses, barClasses, BarChart } from '@mui/x-charts';

// ==============================|| MONTHLY BAR CHART ||============================== //

export default function MonthlyBarChart({ data = [] }) {
  const theme = useTheme();

  const values = data.map((item) => item.income);
  const labels = data.map((item) => item.day);

  return (
    <BarChart
      hideLegend
      height={380}
      series={[
        {
          data: values,
          label: 'Income'
        }
      ]}
      xAxis={[
        {
          data: labels,
          scaleType: 'band',
          tickSize: 7,
          disableLine: true,
          categoryGapRatio: 0.4
        }
      ]}
      yAxis={[
        {
          position: 'none'
        }
      ]}
      slotProps={{
        bar: {
          rx: 5,
          ry: 5
        }
      }}
      axisHighlight={{ x: 'none' }}
      margin={{ left: 20, right: 20 }}
      colors={[theme.vars.palette.info.light]}
      sx={{
        [`& .${barClasses.element}:hover`]: {
          opacity: 0.6
        },
        [`& .${axisClasses.root}.${axisClasses.directionX} .${axisClasses.tick}`]: {
          stroke: 'transparent'
        }
      }}
    />
  );
}

MonthlyBarChart.propTypes = {
  data: PropTypes.array
};
