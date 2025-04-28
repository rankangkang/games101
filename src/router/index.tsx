import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { ROUTE_BASE_NAME } from '../config'
import { routeConfig } from './config'

const router = createBrowserRouter(routeConfig, { basename: ROUTE_BASE_NAME })

export function Router() {
  return <RouterProvider router={router} />
}
