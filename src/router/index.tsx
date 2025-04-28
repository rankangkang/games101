import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { routeConfig } from './config'

const router = createBrowserRouter(routeConfig)

export function Router() {
  return <RouterProvider router={router} />
}
