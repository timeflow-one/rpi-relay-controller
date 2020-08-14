import { Entity, Column, ManyToMany, JoinTable, OneToMany, ManyToOne, JoinColumn } from 'typeorm'
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
    default: process.env.DEFAULT_LOCK_TIMEOUT
  })
  timeout

  /**
   * @type {RelayEntity | null}
   */
  @ManyToOne(() => RelayEntity, relay => relay.in, {
    nullable: true,
    eager: true,
    cascade: true,
    onDelete: 'RESTRICT'
  })
  @JoinColumn({
    name: 'relay_in'
  })
  relayIn

  /**
   * @type {RelayEntity | null}
   */
  @ManyToOne(() => RelayEntity, relay => relay.out, {
    nullable: true,
    eager: true,
    cascade: true,
    onDelete: 'RESTRICT'
  })
  @JoinColumn({
    name: 'relay_out'
  })
  relayOut
}
