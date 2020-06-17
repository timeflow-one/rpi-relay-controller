import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * @abstract
 */
export class BaseEntity {
  /**
   * @type {number}
   */
  @PrimaryGeneratedColumn({
    type: 'int'
  })
  id

  /**
   * @type {Date}
   */
  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime'
  })
  createdAt

  /**
   * @type {Date}
   */
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime'
  })
  updatedAt
}
