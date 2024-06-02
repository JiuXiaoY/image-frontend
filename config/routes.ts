export default [
  { path: '/', name: '主页', icon: 'smile', component: './Index' },
  {
    path: '/interface_info/:id',
    name: '查看接口',
    icon: 'smile',
    component: './InterfaceInfo',
    hideInMenu: true,
  },
  {
    path: '/purchaseRecord',
    name: '购买记录',
    icon: 'table',
    component: './PurchaseRecord',
    hideInMenu: true,
  },
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './User/Login' },
      { name: '注册', path: '/user/register', component: './User/Register' },
    ],
  },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        name: '接口信息',
        icon: 'table',
        path: '/admin/interface_info',
        component: './Admin/InterfaceInfo',
      },
      {
        name: '接口分析',
        icon: 'analysis',
        path: '/admin/interface_analysis',
        component: './Admin/InterfaceAnalysis',
      },
    ],
  },
  {
    name: '订单信息',
    icon: 'table',
    access: 'canAdmin',
    path: '/admin/orderInfo',
    component: './Admin/OrderInfo',
  },
  {
    path: '/userInfo',
    name: '用户信息',
    icon: 'UserOutlined',
    component: './UserInfo',
  },
  { path: '*', layout: false, component: './404' },
];
