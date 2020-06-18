import { Entity, Column, OneToOne, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { RelayEntity } from './RelayEntity';
import { RelayDirection } from '@/models/LockType';
import { LockEntity } from './LockEntity';

@Entity()
export class RelayDirectionEntity extends BaseEntity {
  /**
   * @type {RelayDirection}
   */
  @Column({
    name: 'direction',
    type: 'int',
    nullable: false,
    default: RelayDirection.IN
  })
  direction

  /**
   * @type {RelayEntity}
   */
  @OneToOne(type => RelayEntity, relay => relay.direction, {
    cascade: true
  })
  @JoinColumn({
    name: 'relay'
  })
  relay

  /**
   * @type {LockEntity}
   */
  @ManyToOne(type => LockEntity, lock => lock.relays)
  @JoinColumn({
    name: 'lock'
  })
  lock
}
