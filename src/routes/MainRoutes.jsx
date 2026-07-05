import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import AuthGuard from 'components/AuthGuard';

// render- Dashboard
const Dashboard = Loadable(lazy(() => import('pages/dashboard')));
const Orders = Loadable(lazy(() => import('pages/orders')));
const Products = Loadable(lazy(() => import('pages/products')));
const Categories = Loadable(lazy(() => import('pages/categories')));
const Customers = Loadable(lazy(() => import('pages/customers')));
const Riders = Loadable(lazy(() => import('pages/riders')));
const Coupons = Loadable(lazy(() => import('pages/coupons')));
const Reports = Loadable(lazy(() => import('pages/reports')));
const Settings = Loadable(lazy(() => import('pages/settings')));
const Notifications = Loadable(lazy(() => import('pages/notifications')));
const AbandonedCarts = Loadable(lazy(() => import('pages/carts')));
const OrderDetails = Loadable(lazy(() => import('pages/orders/OrderDetails')));
const CustomerDetails = Loadable(lazy(() => import('pages/customers/CustomerDetails')));
const RiderDetails = Loadable(lazy(() => import('pages/riders/RiderDetails')));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <AuthGuard>
      <DashboardLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '/',
      element: <Dashboard />
    },
    {
      path: 'dashboard',
      element: <Dashboard />
    },
    {
      path: 'orders',
      element: <Orders />
    },
    {
      path: 'products',
      element: <Products />
    },
    {
      path: 'categories',
      element: <Categories />
    },
    {
      path: 'customers',
      element: <Customers />
    },
    {
      path: 'riders',
      element: <Riders />
    },
    {
      path: 'coupons',
      element: <Coupons />
    },
    {
      path: 'reports',
      element: <Reports />
    },
    {
      path: 'settings',
      element: <Settings />
    },
    {
      path: 'orders/:id',
      element: <OrderDetails />
    },
    {
      path: 'customers/:id',
      element: <CustomerDetails />
    },
    {
      path: 'riders/:id',
      element: <RiderDetails />
    },
    {
      path: 'notifications',
      element: <Notifications />
    },
    {
      path: 'abandoned-carts',
      element: <AbandonedCarts />
    }
  ]
};

export default MainRoutes;
