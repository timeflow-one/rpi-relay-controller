import { Entity, Column, Unique, ManyToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { RelayDirection } from '@/models/LockType';
import { LockEntity } from './LockEntity';

@Entity('relays')
@Unique(['gpio', 'direction'])
export class RelayEntity extends BaseEntity {
  /**
   * @type {RelayDirection}
   */
  @Column({
    name: 'direction',
    type: 'simple-enum',
    enum: RelayDirection,
    default: RelayDirection.IN
  })
  direction

  /**
   * @type {number}
   */
  @Column({
    name: 'gpio',
    type: 'int',
    nullable: false
  })
  gpio

  /**
   * @type {Array<LockEntity>}
   */
  @ManyToMany(() => LockEntity, lock => lock.relays, {
    onDelete: 'RESTRICT'
  })
  lock
}
