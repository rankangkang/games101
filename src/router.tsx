import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import HelloWorld from "./entry.mdx";
import { AssignmentDemo } from "./assignments/demo/AssignmentDemo";
import { Assignment01 } from "./assignments/01/Assignment01";
import { Layout } from "./layout";

// Define routes
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <HelloWorld />
      </Layout>
    ),
  },
  {
    path: "/assignments",
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      {
        path: "demo",
        element: <AssignmentDemo />,
      },
      {
        path: "01",
        element: <Assignment01 />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
