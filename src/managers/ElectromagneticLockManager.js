import { Service } from 'typedi';
import { LockType } from '@/models/LockType';
import { LockManager } from './LockManager';
import Exec from 'child_process'

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
   * @param {Array<number>} gpio
   * @param {number} timeout
   * @returns {Promise<any>}
   */
  async open (gpio, timeout) {
    const lockRelay = gpio[0]
    this.cancelCloseLockTask(lockRelay)
    this.setLow(lockRelay)
    this.addCloseLockTask(lockRelay, timeout)
  }

  /**
   * @public
   * @param {Array<number>} gpio
   * @returns {Promise<any>}
   */
  async close (gpio) {
    const lockRelay = gpio[0]
    this.setHigh(lockRelay)
  }

  /**
   * @override
   * @public
   * @param {Array<number>} gpio
   * @returns {Promise<any>}
   */
  async init (gpio) {
    const lockRelay = gpio[0]
    Exec.execSync(`echo ${lockRelay} > /sys/class/gpio/export`)
    Exec.execSync(`echo out > /sys/class/gpio/gpio${lockRelay}/direction`)
    Exec.execSync(`echo 1 > /sys/class/gpio/gpio${lockRelay}/value`)
  }

  /**
   * @override
   * @public
   * @param {Array<number>} gpio
   * @returns {Promise<any>}
   */
  async flush (gpio) {
    const lockRelay = gpio[0]
    Exec.execSync(`echo ${lockRelay} > /sys/class/gpio/unexport`)
  }
}
