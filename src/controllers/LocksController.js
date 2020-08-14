import { KoaController, Controller, Get, Post, Validate, Validator, Delete } from 'koa-joi-controllers';
import { Service, Inject } from 'typedi';
import { getConnection } from 'typeorm';
import { LockEntity } from '@/db/entities/LockEntity';
import { LockType } from '@/models/LockType';
import { Constants } from '@/utils/Constants';
import { LockManager } from '@/managers/LockManager';
import { Logger } from '@/utils/Logger';
import { LockController } from './LockController';

@Service()
@Controller('/api/locks')
export class LocksController extends KoaController {
  /** @type {Array<LockManager>} */
  @Inject(Constants.LOCKS_MANAGERS)
  lockManagers

  /**
   * @private
   * @param {import('koa').Context} ctx
   * @param {import('koa').Next} next
   */
  @Get('/')
  async all (ctx, next) {
    const locks = await getConnection()
      .getRepository(LockEntity)
      .find()

    ctx.status = 200
    ctx.body = {
      data: locks.map(it => ({
        id: it.id,
        destination: it.destination,
        type: it.type,
        timeout: it.timeout,
        is_enabled: it.enabled,
        relay_in: it.relayIn ? {
          id: it.relayIn?.id,
          gpio: it.relayIn?.gpio
        } : null,
        relay_out: it.relayOut ? {
          id: it.relayOut?.id,
          gpio: it.relayOut?.gpio
        } : null,
        created_at: it.createdAt,
        updated_at: it.updatedAt
      }))
    }

    await next()
  }

  /**
   * @private
   * @param {import('koa').Context} ctx
   * @param {import('koa').Next} next
   */
  @Post('/')
  @Validate({
    type: 'json',
    body: {
      site: Validator.Joi
        .string()
        .required(),

      door: Validator.Joi
        .string()
        .required(),

      type: Validator.Joi
        .only(LockType.DIRECT, LockType.COMPOSITE)
        .required(),

      timeout: Validator.Joi
        .number()
        .positive()
        .default(3000),

      is_enabled: Validator.Joi
        .boolean()
        .default(true),

      relay_in: Validator.Joi
        .number()
        .positive()
        .default(null),

      relay_out: Validator.Joi
        .number()
        .positive()
        .default(null)
    }
  })
  async add (ctx, next) {
    const lockRepository = getConnection().getRepository(LockEntity)

    let addedLock = await lockRepository.save(lockRepository.create({
      destination: `${ctx.request.body.site}${process.env.DOOR_SEPARATOR}${ctx.request.body.door}`,
      type: ctx.request.body.type,
      enabled: ctx.request.body.is_enabled,
      timeout: ctx.request.body.timeout,
      relayIn: ctx.request.body.relay_in,
      relayOut: ctx.request.body.relay_out
    }))

    addedLock = await lockRepository.findOneOrFail(addedLock.id)

    try {
      // init lock after add
      await this.lockManagers
        .find(it => it.type == addedLock.type)
        ?.init(addedLock)
    } catch (err) {
      Logger.info(LockController.name, `GPIO's ${addedLock.relayIn?.gpio} or ${addedLock.relayOut?.gpio} already init or can't be init`)
    }

    ctx.status = 200
    ctx.body = {
      data: {
        id: addedLock.id,
        destination: addedLock.destination,
        type: addedLock.type,
        timeout: addedLock.timeout,
        is_enabled: addedLock.enabled,
        relay_in: addedLock.relayIn ? {
          id: addedLock.relayIn?.id,
          gpio: addedLock.relayIn?.gpio
        } : null,
        relay_out: addedLock.relayOut ? {
          id: addedLock.relayOut?.id,
          gpio: addedLock.relayOut?.gpio
        } : null,
        created_at: addedLock.createdAt,
        updated_at: addedLock.updatedAt
      }
    }

    await next()
  }

  /**
   * @private
   * @param {import('koa').Context} ctx
   * @param {import('koa').Next} next
   */
  @Delete('/:id')
  async remove (ctx, next) {
    const lockRepository = getConnection().getRepository(LockEntity)
    const lock = await lockRepository.findOneOrFail(ctx.request.params.id)
    await lockRepository.remove(lock)

    // try {
    //   // flush lock after add
    //   await this.lockManagers
    //     .find(it => it.type == lock.type)
    //     ?.flush(lock)
    // } catch (err) {
    //   Logger.info(LockController.name, `GPIO's ${lock.relayIn?.gpio} or ${lock.relayOut?.gpio} already flush or can't be flushed`)
    // }

    ctx.status = 204

    await next()
  }

  /**
   * @private
   * @param {import('koa').Context} ctx
   * @param {import('koa').Next} next
   */
  @Get('/types')
  async types (ctx, next) {
    ctx.status = 200
    ctx.body = {
      data: [
        LockType.DIRECT,
        // LockType.COMPOSITE
      ]
    }

    await next()
  }
}
