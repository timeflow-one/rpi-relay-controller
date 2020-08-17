import { LockManager } from './LockManager';
import { LockType } from '@/models/LockType';
import { LockEntity } from '@/db/entities/LockEntity';
import { RelayEntity } from '@/db/entities/RelayEntity';
import { ConfigureException } from '@/exceptions/ConfigureException';
import Exec from 'child_process'
import { RelayException } from '@/exceptions/RelayException';
import { Inject } from 'typedi';
import { Constants } from '@/utils/Constants';
import { sleep } from '@/utils/Sleep';

export class CompositeLockManager extends LockManager {
  /** @type {number} */
  @Inject(Constants.ELECTROMOTOR_TURN_TIMEOUT)
  electromotorTurnTimeout

  /**
  * @public
  * @readonly
  * @type {LockType}
  */
  type = LockType.COMPOSITE

  /**
   * @override
   * @public
   * @param {LockEntity} lock
   * @param {number} timeout
   * @returns {Promise<any>}
   */
  async open (lock, timeout) {
    try {
      this.cancelCloseLockTask(lock)
      this.setLow(this.getRelayIn(lock))
      await sleep(this.electromotorTurnTimeout)
      this.setHigh(this.getRelayIn(lock))

      this.addCloseLockTask(lock, timeout)
    } catch (err) {
      throw new RelayException(`Error open relay, using gpio's: ${this.getRelayIn(lock).gpio} and ${this.getRelayOut(lock).gpio}`)
    }
  }

  /**
   * @public
   * @param {LockEntity} lock
   * @returns {Promise<any>}
   */
  async close (lock) {
    try {
      this.setLow(this.getRelayOut(lock))
      await sleep(this.electromotorTurnTimeout)
      this.setHigh(this.getRelayOut(lock))
    } catch (err) {
      throw new RelayException(`Error open relay, using gpio's: ${this.getRelayIn(lock).gpio} and ${this.getRelayOut(lock).gpio}`)
    }
  }

  /**
   * @override
   * @public
   * @param {LockEntity} lock
   * @returns {Promise<any>}
   */
  async init (lock) {
    try {
      // init relay in
      Exec.execSync(`echo ${this.getRelayIn(lock).gpio} > /sys/class/gpio/export`)
      Exec.execSync(`echo out > /sys/class/gpio/gpio${this.getRelayIn(lock).gpio}/direction`)
      Exec.execSync(`echo ${process.env.INIT_RELAY_STATE} > /sys/class/gpio/gpio${this.getRelayIn(lock).gpio}/value`)

      // init relay out
      Exec.execSync(`echo ${this.getRelayOut(lock).gpio} > /sys/class/gpio/export`)
      Exec.execSync(`echo out > /sys/class/gpio/gpio${this.getRelayOut(lock).gpio}/direction`)
      Exec.execSync(`echo ${process.env.INIT_RELAY_STATE} > /sys/class/gpio/gpio${this.getRelayOut(lock).gpio}/value`)
    } catch (err) {
      throw new RelayException(`Error init relay, using gpio's: ${this.getRelayIn(lock).gpio} and ${this.getRelayOut(lock).gpio}`)
    }
  }

  /**
   * @override
   * @public
   * @param {LockEntity} lock
   * @returns {Promise<any>}
   */
  async flush (lock) {
    try {
      // init relay in
      Exec.execSync(`echo ${this.getRelayIn(lock).gpio} > /sys/class/gpio/unexport`)

      // init relay out
      Exec.execSync(`echo ${this.getRelayOut(lock).gpio} > /sys/class/gpio/unexport`)
    } catch (err) {
      throw new RelayException(`Error flush relay, using gpio's: ${this.getRelayIn(lock).gpio} and ${this.getRelayOut(lock).gpio}`)
    }
  }

  /**
   * @private
   * @param {LockEntity} lock
   * @returns {RelayEntity}
   */
  getRelayIn (lock) {
    const relay = lock.relayIn

    if (!relay)
      throw new ConfigureException(`Lock '${lock.destination}' is not configured`)

    return relay
  }

  /**
   * @private
   * @param {LockEntity} lock
   * @returns {RelayEntity}
   */
  getRelayOut (lock) {
    const relay = lock.relayOut

    if (!relay)
      throw new ConfigureException(`Lock '${lock.destination}' is not configured`)

    return relay
  }
}
