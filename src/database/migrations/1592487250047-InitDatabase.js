import { QueryRunner } from 'typeorm'
import { RelayEntity } from '../entities/RelayEntity'

export class InitDatabase1592487250047 {
  /**
   * @param {QueryRunner} queryRunner
   * @returns {Promise<void>}
   */
  async up (queryRunner) {
    const availableRelays = require('#/config/available_relays.json')
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
