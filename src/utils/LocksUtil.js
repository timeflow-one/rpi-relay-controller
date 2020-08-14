import { getConnection } from 'typeorm'
import { LockManager } from '@/managers/LockManager'
import { LockEntity } from '@/db/entities/LockEntity'
import { ConfigureException } from '@/exceptions/ConfigureException'
import { Logger } from './Logger'

/**
 * @param {Array<LockManager>} lockManagers
 */
export async function initLocks (lockManagers) {
  const connection = getConnection()

  const locks = await connection.getRepository(LockEntity)
    .find()

  for (let lock of locks) {
    try {
      const lockManager = lockManagers.find(it => it.type == lock.type)

      if (!lockManager)
        throw new ConfigureException(`Missing manager for '${lock.type}' lock`)

      await lockManager.init(lock)
    } catch (err) {
      Logger.error('Init locks', err)
    }
  }
}
