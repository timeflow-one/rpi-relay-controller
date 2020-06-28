import { QueryRunner } from "typeorm";
import { LockEntity } from '../entities/LockEntity';
import { RelayEntity } from '../entities/RelayEntity';

export class InitLocks1592499678623 {
  /**
   * @param {QueryRunner} queryRunner
   * @returns {Promise<void>}
   */
  async up (queryRunner) {
    /** @type {Array<LockEntity>} */
    const availableLocks = require(String(process.env.AVAILABLE_LOCKS))
    const lockRepository = queryRunner.connection.getRepository(LockEntity)
    const relayRepository = queryRunner.connection.getRepository(RelayEntity)

    for (let lock of availableLocks) {
      /** @type {Array<RelayEntity>} */
      const relays = []

      for (let relay of lock.relays) {
        const foundRelay = await relayRepository.findOneOrFail({
          gpio: relay.relay.gpio
        })

        relays.push(foundRelay)
      }

      await lockRepository.save(lockRepository.create({
        destination: lock.destination,
        type: lock.type,
        enabled: lock.enabled,
        timeout: lock.timeout,
        relays: Array.from({ length: relays.length }, (_, i) => ({
          direction: lock.relays[i].direction,
          relay: relays[i]
        }))
      }))
    }
  }

  /**
   * @param {QueryRunner} queryRunner
   * @returns {Promise<void>}
   */
  async down (queryRunner) {
    await queryRunner
      .connection
      .getRepository(LockEntity)
      .delete({})
  }
}
