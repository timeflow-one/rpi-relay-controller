import { Service } from 'typedi';
import { LockType } from '@/models/LockType';
import { LockManagers } from './LockManagers';

@Service()
export class ElectromagneticLockManager extends LockManagers {
  type = LockType.ELECTROMAGNETIC

  /**
   * @override
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
  close (gpio) {
    throw new Error('Must be implemented!')
  }

  /**
   * @override
   * @public
   * @param {Array<number>} gpio
   * @returns {Promise<any>}
   */
  init (gpio) {
    throw new Error('Not implemented')
  }

  /**
   * @override
   * @public
   * @param {Array<number>} gpio
   * @returns {Promise<any>}
   */
  flush (gpio) {
    throw new Error('Not implemented')
  }
}
