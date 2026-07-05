import { DashboardOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const icons = {
  DashboardOutlined,
  ShoppingCartOutlined
};

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'orders',
      title: 'Orders',
      type: 'item',
      url: '/orders',
      icon: icons.ShoppingCartOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
