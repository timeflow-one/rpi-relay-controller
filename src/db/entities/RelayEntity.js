import { Entity, Column, OneToOne, ManyToOne, JoinColumn, Unique, ManyToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { RelayDirection } from '@/models/LockType';
import { LockEntity } from './LockEntity';

@Entity('relays')
// @Unique(['id', 'lock'])
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
    unique: true,
    nullable: false
  })
  gpio

  /**
   * @type {LockEntity}
   */
  @ManyToMany(() => LockEntity, lock => lock.relays, {
    onDelete: 'CASCADE'
  })
  lock
}
