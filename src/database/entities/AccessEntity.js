import { Entity, Column } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity()
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
    name: 'source',
    type: 'text',
    nullable: false
  })
  source
}
