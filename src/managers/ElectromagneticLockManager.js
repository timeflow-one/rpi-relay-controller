import { Service } from 'typedi';
import { LockType, RelayDirection } from '@/models/LockType';
import { LockManager } from './LockManager';
import Exec from 'child_process'
import { LockEntity } from '@/database/entities/LockEntity';
import { RelayEntity } from '@/database/entities/RelayEntity';

@Service()
export class ElectromagneticLockManager extends LockManager {
  /**
   * @public
   * @readonly
   */
  type = LockType.ELECTROMAGNETIC

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
    Exec.execSync(`echo ${this.getRelay(lock)} > /sys/class/gpio/export`)
    Exec.execSync(`echo out > /sys/class/gpio/gpio${this.getRelay(lock)}/direction`)
    Exec.execSync(`echo 1 > /sys/class/gpio/gpio${this.getRelay(lock)}/value`)
  }

  /**
   * @override
   * @public
   * @param {LockEntity} lock
   * @returns {Promise<any>}
   */
  async flush (lock) {
    Exec.execSync(`echo ${this.getRelay(lock)} > /sys/class/gpio/unexport`)
  }

  /**
   * @private
   * @param {LockEntity} lock
   * @returns {RelayEntity}
   */
  getRelay (lock) {
    const relay = lock.relays.find(it => it.direction == RelayDirection.IN)
    if (!relay)
      throw new Error('lock is not configured')

    return relay.relay
  }
}
