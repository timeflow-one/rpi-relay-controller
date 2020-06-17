import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { LockType } from '@/models/LockType'

@Entity()
export class LockEntity {
  /**
   * @type {number}
   */
  @PrimaryGeneratedColumn({
    type: 'int'
  })
  id

  /**
   * @type {string}
   */
  @Column({
    type: 'text'
  })
  source

  /**
   * @type {Array<number>}
   */
  @Column({
    type: 'text',
    transformer: {
      /** @param {Array<number>} value */
      to (value) {
        return JSON.stringify(value)
      },
      /** @param {string} value */
      from (value) {
        return JSON.parse(value)
      }
    }
  })
  locks

  /**
   * @type {LockType}
   */
  @Column({
    type: 'text'
  })
  type

  /**
   * @type {boolean}
   */
  @Column({
    type: 'bool'
  })
  enabled
}
