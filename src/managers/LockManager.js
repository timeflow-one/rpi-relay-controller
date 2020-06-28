import Exec from 'child_process'
import { LockType } from '@/models/LockType'
import { LockEntity } from '@/db/entities/LockEntity'
import { RelayEntity } from '@/db/entities/RelayEntity'

/**
 * @abstract
 */
export class LockManager {
  /**
   * @abstract
   * @readonly
   * @type {LockType}
   */
  type

  /**
   * @private
   * @readonly
   * @type {Map<number, NodeJS.Timeout>}
   */
  tasks = new Map()

  /**
   * @abstract
   * @param {LockEntity} lock
   * @param {number} timeout
   * @returns {Promise<any>}
   */
  open (lock, timeout) {
    throw new Error('Must be implemented!')
  }

  /**
   * @abstract
   * @param {LockEntity} lock
   * @returns {Promise<any>}
   */
  close (lock) {
    throw new Error('Must be implemented!')
  }

  /**
   * @abstract
   * @param {LockEntity} lock
   * @returns {Promise<any>}
   */
  init (lock) {
    throw new Error('Must be implemented!')
  }

  /**
   * @abstract
   * @param {LockEntity} lock
   * @returns {Promise<any>}
   */
  flush (lock) {
    throw new Error('Must be implemented!')
  }

  /**
   * @protected
   * @param {RelayEntity} gpio
   */
  setHigh (gpio) {
    Exec.execSync(`echo 1 > /sys/class/gpio/gpio${gpio.gpio}/value`)
  }

  /**
   * @protected
   * @param {RelayEntity} gpio
   */
  setLow (gpio) {
    Exec.execSync(`echo 0 > /sys/class/gpio/gpio${gpio.gpio}/value`)
  }

  /**
   * @protected
   * @param {LockEntity} lock
   * @param {number} timeout
   */
  addCloseLockTask (lock, timeout) {
    const closeLockTask = setTimeout(() => this.close(lock), timeout)
    this.tasks.set(lock.id, closeLockTask)
  }

  /**
   * @protected
   * @param {LockEntity} lock
   */
  cancelCloseLockTask (lock) {
    const task = this.tasks.get(lock.id)
    if (task) {
      clearTimeout(task)
      this.tasks.delete(lock.id)
    }
  }
}
