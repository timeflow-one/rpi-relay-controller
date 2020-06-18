import { ElemagLockManager } from './ElmagLockManager';
import { LockType } from '@/models/LockType';
import { Service } from 'typedi';

@Service()
export class ElmechLockManager extends ElemagLockManager {
  /**
   * @public
   * @readonly
   * @type {LockType}
   */
  type = LockType.ELECTROMECHANICAL
}
