import { getConnection } from 'typeorm'
import { Logger } from './Logger'
import { RelayEntity } from '@/db/entities/RelayEntity'
import { RelayManager } from '@/managers/RelayManager'

/**
 * @param {RelayManager} relayManager
 */
export async function initLocks (relayManager) {
  const connection = getConnection()

  const relays = await connection.getRepository(RelayEntity)
    .find()

  for (let relay of relays) {
    try {
      await relayManager.init(relay)
    } catch (err) {
      Logger.error('Init locks', err)
    }
  }
}
