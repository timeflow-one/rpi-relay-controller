import Exec from 'child_process'

/**
 * @abstract
 */
export class LockManagers {
  /**
   * @private
   * @type {Map<number, NodeJS.Timeout>}
   */
  tasks

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
   * @param {Array<number>} gpio
   * @param {number} timeout
   */
  addCloseLockTask (gpio, timeout) {
    const closeLockTask = setTimeout(() => this.close(gpio), timeout)
    this.tasks.set(gpio[0], closeLockTask)
  }

  /**
   * @protected
   * @param {Array<number>} gpio
   */
  cancelCloseLockTask (gpio) {
    const task = this.tasks.get(gpio[0])
    if (task) {
      clearTimeout(task)
      this.tasks.delete(gpio[0])
    }
  }
}
