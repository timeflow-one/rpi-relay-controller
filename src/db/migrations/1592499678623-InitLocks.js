import { QueryRunner } from "typeorm";
import { LockEntity } from '../entities/LockEntity';
import { RelayEntity } from '../entities/RelayEntity';

export class InitLocks1592499678623 {
  /**
   * @param {QueryRunner} queryRunner
   * @returns {Promise<void>}
   */
  async up (queryRunner) {
    const availableLocks = require(String(process.env.AVAILABLE_LOCKS))
    const lockRepository = queryRunner.connection.getRepository(LockEntity)
    const relayRepository = queryRunner.connection.getRepository(RelayEntity)

    for (let lock of availableLocks) {
      const relayIn = lock.relay_in != null ? await relayRepository.findOneOrFail(lock.relay_in) : lock.relay_in
      const relayOut = lock.relay_out != null ? await relayRepository.findOneOrFail(lock.relay_out) : lock.relay_out

      await lockRepository.save(lockRepository.create({
        destination: lock.destination,
        type: lock.type,
        enabled: lock.enabled,
        timeout: lock.timeout,
        relayIn: relayIn,
        relayOut: relayOut
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
