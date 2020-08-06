import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm'
import { LockType } from '@/models/LockType'
import { BaseEntity } from './BaseEntity'
import { RelayEntity } from './RelayEntity'

@Entity('locks')
export class LockEntity extends BaseEntity {
  /**
   * Access point identifier, object name in the Timeflow
   * @type {string}
   */
  @Column({
    name: 'destination',
    type: 'text',
    unique: true,
    nullable: false
  })
  destination

  /**
   * @type {LockType}
   */
  @Column({
    name: 'type',
    type: 'simple-enum',
    enum: LockType,
    nullable: false
  })
  type

  /**
   * @type {boolean}
   */
  @Column({
    name: 'enabled',
    type: 'boolean',
    nullable: false,
    default: true
  })
  enabled

  /**
   * @type {number}
   */
  @Column({
    name: 'timeout',
    type: 'int',
    nullable: false,
    default: process.env.LOCK_TIMEOUT
  })
  timeout

  /**
   * @type {Array<RelayEntity>}
   */
  @ManyToMany(() => RelayEntity, relay => relay.lock, {
    eager: true,
    cascade: true
  })
  @JoinTable()
  relays
}
