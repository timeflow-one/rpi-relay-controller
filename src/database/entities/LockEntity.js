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
    nullable: false
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
    },
    nullable: false
  })
  locks

  /**
   * @type {LockType}
   */
  @Column({
    name: 'type',
    type: 'text',
    nullable: false
  })
  type

  /**
   * @type {boolean}
   */
  @Column({
    name: 'enabled',
    type: 'boolean',
    nullable: false
  })
  enabled

  /**
   * @type {number}
   */
  @Column({
    name: 'timeout',
    type: 'int',
    nullable: false
  })
  timeout
}
