import { Entity, Column, OneToOne, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { RelayEntity } from './RelayEntity';
import { RelayDirection } from '@/models/LockType';
import { LockEntity } from './LockEntity';

@Entity()
@Unique(['id', 'lock'])
export class RelayDirectionEntity extends BaseEntity {
  /**
   * @type {RelayDirection}
   */
  @Column({
    name: 'direction',
    type: 'simple-enum',
    enum: RelayDirection,
    nullable: false,
    default: RelayDirection.IN
  })
  direction

  /**
   * @type {RelayEntity}
   */
  @OneToOne(() => RelayEntity, relay => relay.direction, {
    cascade: true,
    eager: true
  })
  @JoinColumn({
    name: 'id'
  })
  relay

  /**
   * @type {LockEntity}
   */
  @ManyToOne(() => LockEntity, lock => lock.relays)
  @JoinColumn({
    name: 'id'
  })
  lock
}
