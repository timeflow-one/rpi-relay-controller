import { Entity, Column, OneToMany, OneToOne, JoinColumn, Unique } from 'typeorm'
import { LockType } from '@/models/LockType'
import { BaseEntity } from './BaseEntity'
import { RelayEntity } from './RelayEntity'
import { RelayDirectionEntity } from './RelayDirectionEntity'

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
    default: 5000
  })
  timeout

  /**
   * @type {Array<RelayDirectionEntity>}
   */
  @OneToMany(type => RelayDirectionEntity, relay => relay.lock, {
    eager: true,
    cascade: true
  })
  relays
}
