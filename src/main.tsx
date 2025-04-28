import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ROUTE_BASE_NAME, SERVICE_WORKER_PATH } from './config'
import { idb } from './db'
import { Router } from './router'
import './styles/style.css'
import { registryServiceWorker } from './utils/registryServiceWorker'

registryServiceWorker(SERVICE_WORKER_PATH, ROUTE_BASE_NAME).then(async () => {
  await idb.getDB()
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Router />
    </StrictMode>,
  )
})
