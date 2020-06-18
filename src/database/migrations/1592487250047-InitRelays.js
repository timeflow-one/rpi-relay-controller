import { QueryRunner } from 'typeorm'
import { RelayEntity } from '../entities/RelayEntity'

export class InitRelays1592487250047 {
  /**
   * @param {QueryRunner} queryRunner
   * @returns {Promise<void>}
   */
  async up (queryRunner) {
    /** @type {Array<number>} */
    const availableRelays = require(String(process.env.AVAILABLE_RELAYS))
    const relayRepository = queryRunner.connection.getRepository(RelayEntity)

    for (let relay of availableRelays) {
      await relayRepository.save(relayRepository.create({
        gpio: relay
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
      .getRepository(RelayEntity)
      .delete({})
  }
}
