import type { IDBOptions } from './db/idb'

export const ROUTE_BASE_NAME = '/games101'

export const SERVICE_WORKER_PATH = `${ROUTE_BASE_NAME}/sw.js`
export const SERVICE_WORKER_SCOPE = `${ROUTE_BASE_NAME}/`
export const ASSIGNMENTS_BASE_PREFIX = `${ROUTE_BASE_NAME}/_assignments`

export const IDB_OPTIONS: IDBOptions = {
  name: 'games101',
  storeName: 'games101_assignments_storage',
  version: 1,
}
