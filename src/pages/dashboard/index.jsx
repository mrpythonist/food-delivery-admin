import { useState } from 'react';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import MonthlyBarChart from 'sections/dashboard/default/MonthlyBarChart';
import UniqueVisitorCard from 'sections/dashboard/default/UniqueVisitorCard';
import OrdersTable from 'sections/dashboard/default/OrdersTable';
import { useDashboard } from 'api/dashboard';
import CircularProgress from '@mui/material/CircularProgress';
import EllipsisOutlined from '@ant-design/icons/EllipsisOutlined';
export default function Dashboard() {
  const [orderMenuAnchor, setOrderMenuAnchor] = useState(null);
  const { dashboard, dashboardLoading } = useDashboard();
  const handleOrderMenuClick = (event) => {
    setOrderMenuAnchor(event.currentTarget);
  };
  const handleOrderMenuClose = () => {
    setOrderMenuAnchor(null);
  };
  if (dashboardLoading) {
    return (
      <Box
        sx={{
          height: '60vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce title="Today's Orders" count={dashboard.cards.today_orders} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce title="Today's Revenue" count={`Rs. ${dashboard.cards.today_revenue}`} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce title="Pending Orders" count={dashboard.cards.pending_orders} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce title="Online Riders" count={dashboard.cards.online_riders} />
      </Grid>
      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />
      {/* row 2 */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <UniqueVisitorCard data={dashboard.sales_by_month} />
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <Typography variant="h5">Income Overview</Typography>
          </Grid>
          <Grid />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack sx={{ gap: 2 }}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                This Week Statistics
              </Typography>
              <Typography variant="h3">
                PKR {dashboard.income_overview.reduce((sum, day) => sum + Number(day.income), 0).toLocaleString('en-PK')}
              </Typography>
            </Stack>
          </Box>
          <MonthlyBarChart data={dashboard.income_overview} />
        </MainCard>
      </Grid>
      {/* row 3 */}
      <Grid size={{ xs: 12, md: 12, lg: 12 }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <Typography variant="h5">Recent Orders</Typography>
          </Grid>
          <Grid>
            <IconButton onClick={handleOrderMenuClick}>
              <EllipsisOutlined style={{ fontSize: '1.25rem' }} />
            </IconButton>
            <Menu
              id="fade-menu"
              slotProps={{ list: { 'aria-labelledby': 'fade-button' } }}
              anchorEl={orderMenuAnchor}
              onClose={handleOrderMenuClose}
              open={Boolean(orderMenuAnchor)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleOrderMenuClose}>Export as CSV</MenuItem>
              <MenuItem onClick={handleOrderMenuClose}>Export as Excel</MenuItem>
              <MenuItem onClick={handleOrderMenuClose}>Print Table</MenuItem>
            </Menu>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersTable orders={dashboard.latest_orders} />
        </MainCard>
      </Grid>
    </Grid>
  );
}
