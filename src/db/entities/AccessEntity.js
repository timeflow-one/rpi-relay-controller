import { Entity, Column } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity('acceses')
export class AccessEntity extends BaseEntity {
  /**
   * @type {string}
   */
  @Column({
    name: 'initiator',
    type: 'text',
    nullable: false
  })
  initiator

  /**
   * Access point identifier, object name in the Timeflow
   * @type {string}
   */
  @Column({
    name: 'destination',
    type: 'text',
    nullable: false
  })
  destination
}
