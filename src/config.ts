import type { IDBOptions } from './db/idb'

export const SERVICE_WORKER_PATH = '/sw.js'
export const ASSIGNMENTS_BASE_PREFIX = '/_assignments/'

export const IDB_OPTIONS: IDBOptions = {
  name: 'games101',
  storeName: 'games101_assignments_storage',
  version: 1,
}

export const ROUTE_BASE_NAME = '/games101'
