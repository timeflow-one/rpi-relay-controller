import { RelayEntity } from '@/db/entities/RelayEntity'
import Exec from 'child_process'
import { RelayException } from '@/exceptions/RelayException'
import { Service } from 'typedi'

@Service()
export class RelayManager {
  /**
   * @public
   * @param {RelayEntity} relay
   * @returns {Promise<any>}
   */
  async init (relay) {
    try {
      Exec.execSync(`echo ${relay.gpio} > /sys/class/gpio/export`)
      Exec.execSync(`echo out > /sys/class/gpio/gpio${relay.gpio}/direction`)
      Exec.execSync(`echo 1 > /sys/class/gpio/gpio${relay.gpio}/value`)
    } catch (err) {
      throw new RelayException(`Error init gpio: ${relay.gpio}`)
    }
  }
}
