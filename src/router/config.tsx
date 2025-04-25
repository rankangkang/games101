import { Outlet, RouteObject, Navigate } from "react-router-dom";
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
    element: <Navigate to="/assignments" replace />,
    meta: {
      showInSidebar: false,
    },
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
        index: true,
        element: <AssignmentDemo />,
        meta: {
          showInSidebar: false,
        },
      },
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
