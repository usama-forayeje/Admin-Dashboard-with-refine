import type { IResourceItem } from "@refinedev/core";

import {
  DashboardOutlined,
  OrderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";

export const resources: IResourceItem[] = [
  {
    name: "dashboard",
    list: "/",
    meta: {
      label: "Dashboard",
      icon: <DashboardOutlined />,
    },
  },
  {
    name: "workers",
    list: "/workers",
    show: "/workers/:id",
    create: "/workers/new",
    edit: "/workers/edit/:id",
    meta: {
      label: "Workers",
      icon: <UserOutlined />,
    },
  },
  {
    name: "orders",
    list: "/orders",
    create: "/orders/new",
    edit: "/orders/edit/:id",
    meta: {
      label: "Orders",
      icon: <OrderedListOutlined />,
    },
  },
];