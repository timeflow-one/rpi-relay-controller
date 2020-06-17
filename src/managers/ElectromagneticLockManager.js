import { Service } from 'typedi';
import { LockType } from '@/models/LockType';

@Service()
export class ElectromagneticLockManager {
  /**
   * @public
   * @readonly
   */
  type = LockType.ELECTROMAGNETIC

  /**
   * @public
   * @param {Array<number>} gpio
   * @returns {Promise<any>}
   */
  open (gpio) {
    throw new Error('Not implemented')
  }

  /**
   * @public
   * @param {Array<number>} gpio
   * @returns {Promise<any>}
   */
  init (gpio) {
    throw new Error('Not implemented')
  }
}
