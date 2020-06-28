import { Service } from 'typedi';
import { LockType, RelayDirection } from '@/models/LockType';
import { LockManager } from './LockManager';
import Exec from 'child_process'
import { LockEntity } from '@/database/entities/LockEntity';
import { RelayEntity } from '@/database/entities/RelayEntity';
import { ConfigureException } from '@/exceptions/ConfigureException';

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
    this.cancelCloseLockTask(lock)
    this.setLow(this.getRelay(lock))
    this.addCloseLockTask(lock, timeout)
  }

  /**
   * @public
   * @param {LockEntity} lock
   * @returns {Promise<any>}
   */
  async close (lock) {
    this.setHigh(this.getRelay(lock))
  }

  /**
   * @override
   * @public
   * @param {LockEntity} lock
   * @returns {Promise<any>}
   */
  async init (lock) {
    Exec.execSync(`echo ${this.getRelay(lock).gpio} > /sys/class/gpio/export`)
    Exec.execSync(`echo out > /sys/class/gpio/gpio${this.getRelay(lock).gpio}/direction`)
    Exec.execSync(`echo 1 > /sys/class/gpio/gpio${this.getRelay(lock).gpio}/value`)
  }

  /**
   * @override
   * @public
   * @param {LockEntity} lock
   * @returns {Promise<any>}
   */
  async flush (lock) {
    Exec.execSync(`echo ${this.getRelay(lock).gpio} > /sys/class/gpio/unexport`)
  }

  /**
   * @private
   * @param {LockEntity} lock
   * @returns {RelayEntity}
   */
  getRelay (lock) {
    const relay = lock.relays.find(it => it.direction == RelayDirection.IN)
    if (!relay)
      throw new ConfigureException(`Lock '${lock.destination}' is not configured`)

    return relay.relay
  }
}
