import { Outlet, RouteObject } from "react-router-dom";
import { AssignmentDemo } from "../assignments/demo/AssignmentDemo";
import { Assignment01 } from "../assignments/01/Assignment01";

interface RouteMetadata {
  title?: string;
  icon?: React.ReactNode;
  position?: "top" | "bottom";
  showInSidebar?: boolean;
}

export type RouteConfig = RouteObject & {
  meta?: RouteMetadata;
  children?: RouteConfig[];
};

export const routeConfig: RouteConfig[] = [
  {
    path: "/",
    meta: {
      showInSidebar: false,
    },
    index: true,
  },
  {
    path: "/assignments",
    element: <Outlet />,
    meta: {
      title: "Assignments",
      icon: "☰",
      position: "bottom",
      showInSidebar: true,
    },
    children: [
      {
        path: "demo",
        element: <AssignmentDemo />,
        meta: {
          title: "Demo Assignment",
          showInSidebar: true,
        },
      },
      {
        path: "01",
        element: <Assignment01 />,
        meta: {
          title: "Assignment 1",
          showInSidebar: true,
        },
      },
    ],
  },
];
