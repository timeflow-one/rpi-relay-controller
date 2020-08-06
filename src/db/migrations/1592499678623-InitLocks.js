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
        let foundRelay = await relayRepository.findOneOrFail({
          gpio: relay.gpio
        })

        foundRelay = await relayRepository.save({
          ...foundRelay,
          direction: relay.direction
        })

        relays.push(foundRelay)
      }

      await lockRepository.save(lockRepository.create({
        destination: lock.destination,
        type: lock.type,
        enabled: lock.enabled,
        timeout: lock.timeout,
        relays
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
