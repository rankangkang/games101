import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SERVICE_WORKER_PATH, SERVICE_WORKER_SCOPE } from './config'
import { idb } from './db'
import { Router } from './router'
import './styles/style.css'
import { registryServiceWorker } from './utils/registryServiceWorker'

registryServiceWorker(SERVICE_WORKER_PATH, SERVICE_WORKER_SCOPE).then(async () => {
  await idb.getDB()
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Router />
    </StrictMode>,
  )
})
