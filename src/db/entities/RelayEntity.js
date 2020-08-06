import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { LockEntity } from './LockEntity';

@Entity('relays')
export class RelayEntity extends BaseEntity {
  // /**
  //  * @type {RelayDirection}
  //  */
  // @Column({
  //   name: 'direction',
  //   type: 'simple-enum',
  //   enum: RelayDirection,
  //   default: RelayDirection.IN
  // })
  // direction

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
  @OneToMany(() => LockEntity, lock => lock.relayIn, {
    onDelete: 'RESTRICT'
  })
  in

  /**
   * @type {Array<LockEntity>}
   */
  @OneToMany(() => LockEntity, lock => lock.relayOut, {
    onDelete: 'RESTRICT'
  })
  out
}
