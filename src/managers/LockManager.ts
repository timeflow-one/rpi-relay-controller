import { LockType } from '@/models/LockType'

export interface LockManager {
  type: LockType
  open (gpio: Array<number>, timeout: number): Promise<any>
  close (gpio: Array<number>): Promise<any>
  init (gpio: Array<number>): Promise<any>
  flush (gpio: Array<number>): Promise<any>
}
