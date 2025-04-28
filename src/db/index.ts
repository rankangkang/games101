import { IDB_OPTIONS } from '../config'
import type { FileModel } from '../types'
import { join } from '../utils/path'
import { IDBStore } from './idb'

export const idb = new IDBStore(IDB_OPTIONS)

/**
 * 同步文件模型
 * @param defaultModels 默认文件模型
 * @returns 文件模型
 */
export async function syncFileModels(defaultModels: FileModel[]) {
  return Promise.all(
    defaultModels.map(async (item) => {
      const key = join(item.baseUrl, item.path)
      let model = await idb.getFileModel(key)
      if (!model) {
        model = item
        await idb.setFileModel(key, model)
      }
      return model
    }),
  )
}
