import { LockType } from './LockType';

export interface LockModel {
  id: number
  /** Access point identifier, object name in the Timeflow */
  source: string
  /** GPIO's of relay. [?] for simple lock, [?,?] for complex lock */
  locks: Array<number>
  type: LockType
  enabled: boolean
}
