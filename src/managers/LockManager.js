import Exec from 'child_process'

/**
 * @abstract
 */
export class LockManager {
  /**
   * @private
   * @readonly
   * @type {Map<number, NodeJS.Timeout>}
   */
  tasks = new Map()

  /**
   * @public
   * @param {Array<number>} gpio
   * @param {number} timeout
   * @returns {Promise<any>}
   */
  open (gpio, timeout) {
    throw new Error('Must be implemented!')
  }

  /**
   * @public
   * @param {Array<number>} gpio
   * @returns {Promise<any>}
   */
  close (gpio) {
    throw new Error('Must be implemented!')
  }

  /**
   * @public
   * @param {Array<number>} gpio
   * @returns {Promise<any>}
   */
  init (gpio) {
    throw new Error('Must be implemented!')
  }

  /**
   * @public
   * @param {Array<number>} gpio
   * @returns {Promise<any>}
   */
  flush (gpio) {
    throw new Error('Must be implemented!')
  }

  /**
   * @protected
   * @param {number} gpio
   */
  setHigh (gpio) {
    Exec.execSync(`echo 1 > /sys/class/gpio/gpio${gpio}/value`)
  }

  /**
   * @protected
   * @param {number} gpio
   */
  setLow (gpio) {
    Exec.execSync(`echo 0 > /sys/class/gpio/gpio${gpio}/value`)
  }

  /**
   * @protected
   * @param {number} gpio
   * @param {number} timeout
   */
  addCloseLockTask (gpio, timeout) {
    const closeLockTask = setTimeout(() => this.close([gpio]), timeout)
    this.tasks.set(gpio, closeLockTask)
  }

  /**
   * @protected
   * @param {number} gpio
   */
  cancelCloseLockTask (gpio) {
    const task = this.tasks.get(gpio)
    if (task) {
      clearTimeout(task)
      this.tasks.delete(gpio)
    }
  }
}
