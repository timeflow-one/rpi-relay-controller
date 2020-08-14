import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { LockEntity } from './LockEntity';

@Entity('relays')
export class RelayEntity extends BaseEntity {
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
   * @type {Array<LockEntity>}
   */
  @OneToMany(() => LockEntity, lock => lock.relayIn)
  in

  /**
   * @type {Array<LockEntity>}
   */
  @OneToMany(() => LockEntity, lock => lock.relayOut)
  out
}
