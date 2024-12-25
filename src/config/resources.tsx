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
    name: "companies",
    list: "/companies",
    show: "/companies/:id",
    create: "/companies/new",
    edit: "/companies/edit/:id",
    meta: {
      label: "Companies",
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