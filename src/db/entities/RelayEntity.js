import { Entity, Column, OneToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { RelayDirectionEntity } from './RelayDirectionEntity';

@Entity()
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
   * @type {RelayDirectionEntity}
   */
  @OneToOne(() => RelayDirectionEntity, direction => direction.relay)
  direction
}
