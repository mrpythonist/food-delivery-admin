import {
  ShoppingCartOutlined,
  AppstoreOutlined,
  TagsOutlined,
  UserOutlined,
  CarOutlined,
  GiftOutlined,
  BarChartOutlined,
  SettingOutlined
} from '@ant-design/icons';

const management = {
  id: 'group-management',
  title: 'Management',
  type: 'group',
  children: [
    {
      id: 'products',
      title: 'Products',
      type: 'item',
      url: '/products',
      icon: AppstoreOutlined
    },
    {
      id: 'categories',
      title: 'Categories',
      type: 'item',
      url: '/categories',
      icon: TagsOutlined
    },
    {
      id: 'customers',
      title: 'Customers',
      type: 'item',
      url: '/customers',
      icon: UserOutlined
    },
    {
      id: 'riders',
      title: 'Riders',
      type: 'item',
      url: '/riders',
      icon: CarOutlined
    },
    {
      id: 'coupons',
      title: 'Coupons',
      type: 'item',
      url: '/coupons',
      icon: GiftOutlined
    },
    {
      id: 'reports',
      title: 'Reports',
      type: 'item',
      url: '/reports',
      icon: BarChartOutlined
    },
    {
      id: 'settings',
      title: 'Settings',
      type: 'item',
      url: '/settings',
      icon: SettingOutlined
    },
    {
      id: 'abandoned-carts',
      title: 'Abandoned Carts',
      type: 'item',
      url: '/abandoned-carts',
      icon: ShoppingCartOutlined
    }
  ]
};

export default management;
