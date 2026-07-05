import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';

import { axisClasses, chartsGridClasses, lineClasses, LineChart } from '@mui/x-charts';

import { withAlpha } from 'utils/colorUtils';

export default function IncomeAreaChart({ data = [] }) {
  const theme = useTheme();

  const line = theme.vars.palette.divider;

  const labels = data.map((item) => item.month);

  const sales = data.map((item) => item.sales);

  return (
    <LineChart
      hideLegend
      grid={{
        horizontal: true,
        vertical: false
      }}
      xAxis={[
        {
          scaleType: 'point',
          data: labels,
          tickSize: 7,
          disableLine: true
        }
      ]}
      yAxis={[
        {
          tickSize: 7,
          disableLine: true
        }
      ]}
      height={450}
      margin={{
        top: 40,
        bottom: -5,
        right: 20,
        left: 5
      }}
      series={[
        {
          type: 'line',
          id: 'sales',
          label: 'Sales',
          data: sales,
          area: true,
          showMark: false,
          color: theme.vars.palette.primary.main,
          stroke: theme.vars.palette.primary.main,
          strokeWidth: 2
        }
      ]}
      sx={{
        [`& .${chartsGridClasses.line}`]: {
          strokeDasharray: '4 4',
          stroke: line
        },

        [`& .${lineClasses.area}`]: {
          '&[data-series-id="sales"]': {
            fill: "url('#salesGradient')",
            opacity: 0.8
          }
        },

        [`& .${axisClasses.root}.${axisClasses.directionX} .${axisClasses.tick}`]: {
          stroke: 'transparent'
        },

        [`& .${axisClasses.root}.${axisClasses.directionY} .${axisClasses.tick}`]: {
          stroke: 'transparent'
        }
      }}
    >
      <defs>
        <linearGradient id="salesGradient" gradientTransform="rotate(90)">
          <stop offset="10%" stopColor={withAlpha(theme.vars.palette.primary.main, 0.4)} />

          <stop offset="90%" stopColor={withAlpha(theme.vars.palette.background.default, 0.05)} />
        </linearGradient>
      </defs>
    </LineChart>
  );
}

IncomeAreaChart.propTypes = {
  data: PropTypes.array
};
