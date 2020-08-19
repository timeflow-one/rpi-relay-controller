import { Service } from 'typedi';
import { LockType } from '@/models/LockType';
import { LockManager } from './LockManager';
import Exec from 'child_process'
import { LockEntity } from '@/db/entities/LockEntity';
import { RelayEntity } from '@/db/entities/RelayEntity';
import { ConfigureException } from '@/exceptions/ConfigureException';
import { RelayException } from '@/exceptions/RelayException';

@Service()
export class DirectLockManager extends LockManager {
  /**
   * @public
   * @readonly
   * @type {LockType}
   */
  type = LockType.DIRECT

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
      this.setLow(this.getRelay(lock))
      this.addCloseLockTask(lock, timeout)
    } catch (err) {
      throw new RelayException(`Error open relay on gpio: ${this.getRelay(lock).gpio}`)
    }
  }

  /**
   * @public
   * @param {LockEntity} lock
   * @returns {Promise<any>}
   */
  async close (lock) {
    try {
      this.setHigh(this.getRelay(lock))
    } catch (err) {
      throw new RelayException(`Error close relay on gpio: ${this.getRelay(lock).gpio}`)
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
      Exec.execSync(`echo ${this.getRelay(lock).gpio} > /sys/class/gpio/export`)
      Exec.execSync(`echo out > /sys/class/gpio/gpio${this.getRelay(lock).gpio}/direction`)
      Exec.execSync(`echo ${process.env.INIT_RELAY_STATE} > /sys/class/gpio/gpio${this.getRelay(lock).gpio}/value`)
    } catch (err) {
      throw new RelayException(`Error init gpio: ${this.getRelay(lock).gpio}`)
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
      Exec.execSync(`echo ${this.getRelay(lock).gpio} > /sys/class/gpio/unexport`)
    } catch (err) {
      throw new RelayException(`Error flush gpio: ${this.getRelay(lock).gpio}`)
    }
  }

  /**
   * @private
   * @param {LockEntity} lock
   * @returns {RelayEntity}
   */
  getRelay (lock) {
    const relay = lock.relayIn

    if (!relay)
      throw new ConfigureException(`Lock '${lock.destination}' is not configured`)

    return relay
  }
}
