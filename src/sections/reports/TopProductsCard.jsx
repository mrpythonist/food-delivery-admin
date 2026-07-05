import { Skeleton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import MainCard from 'components/MainCard';

function money(v) {
  return `PKR ${Number(v || 0).toLocaleString()}`;
}

export default function TopProductsCard({ products, loading }) {
  const chartData = products || [];

  return (
    <MainCard title="Top Products">
      {loading ? (
        <Skeleton variant="rounded" height={280} />
      ) : chartData.length === 0 ? (
        <Typography color="text.disabled" fontStyle="italic" textAlign="center" sx={{ py: 6 }}>
          No product sales in this date range.
        </Typography>
      ) : (
        <Stack spacing={3}>
          <BarChart
            dataset={chartData}
            xAxis={[{ dataKey: 'product_name', scaleType: 'band', tickLabelStyle: { fontSize: 11 } }]}
            series={[{ dataKey: 'qty_sold', label: 'Qty Sold', color: '#1890ff' }]}
            height={260}
            margin={{ left: 40, right: 20, top: 20, bottom: 60 }}
          />

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="center">Qty Sold</TableCell>
                <TableCell align="right">Revenue</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chartData.map((p) => (
                <TableRow key={p.product_id} hover>
                  <TableCell>{p.product_name}</TableCell>
                  <TableCell align="center">{p.qty_sold}</TableCell>
                  <TableCell align="right">
                    <Typography fontWeight={600}>{money(p.revenue)}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Stack>
      )}
    </MainCard>
  );
}
