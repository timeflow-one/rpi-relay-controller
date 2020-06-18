import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * @abstract
 */
export class BaseEntity {
  /**
   * @type {number}
   */
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id'
  })
  id

  /**
   * @type {Date}
   */
  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    readonly: true
  })
  createdAt

  /**
   * @type {Date}
   */
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    readonly: true
  })
  updatedAt
}
