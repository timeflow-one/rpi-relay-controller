import { Entity, Column, PrimaryColumn } from 'typeorm'
import { LockType } from '@/models/LockType'
import { BaseEntity } from './BaseEntity'

@Entity()
export class LockEntity extends BaseEntity {
  /**
   * Access point identifier, object name in the Timeflow
   * @type {string}
   */
  @Column({
    name: 'source',
    type: 'text',
    unique: true,
  })
  source

  /**
   * GPIO's of relay. [?] for simple lock, [?,?] for complex lock
   * @type {Array<number>}
   */
  @Column({
    name: 'locks',
    type: 'text',
    transformer: {
      /** @param {Array<number>} value */
      to (value) {
        return JSON.stringify(value)
      },
      /** @param {string} value */
      from (value) {
        return JSON.parse(value)
      }
    }
  })
  locks

  /**
   * @type {LockType}
   */
  @Column({
    name: 'type',
    type: 'text'
  })
  type

  /**
   * @type {boolean}
   */
  @Column({
    name: 'enabled',
    type: 'boolean'
  })
  enabled
}