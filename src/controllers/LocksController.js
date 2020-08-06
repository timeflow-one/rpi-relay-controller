import { KoaController, Controller, Get, Post, Validate, Validator, Delete } from 'koa-joi-controllers';
import { Service } from 'typedi';
import { getConnection } from 'typeorm';
import { LockEntity } from '@/db/entities/LockEntity';
import { LockType, RelayDirection } from '@/models/LockType';
import { RelayEntity } from '@/db/entities/RelayEntity';

@Service()
@Controller('/api/locks')
export class LocksController extends KoaController {
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
        relays: it.relays.map(it => ({
          id: it.id,
          direction: it.direction,
          gpio: it.gpio
        })),
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

      relays: Validator.Joi
        .array()
        .items(
          Validator.Joi.object({
            direction: Validator.Joi
              .only(RelayDirection.IN, RelayDirection.OUT)
              .default(RelayDirection.IN),

            gpio: Validator.Joi
              .number()
              .required()
          })
        )
    }
  })
  async add (ctx, next) {
    const relaysRepository = getConnection().getRepository(RelayEntity)
    const lockRepository = getConnection().getRepository(LockEntity)
    /** @type {Array<RelayEntity>} */
    const relays = []

    for (let rawRelay of ctx.request.body.relays) {
      const relay = await relaysRepository.findOneOrFail({
        gpio: rawRelay.gpio
      })

      relays.push(relay)
    }

    const addedLock = await lockRepository.save(lockRepository.create({
      destination: `${ctx.request.body.site}-${ctx.request.body.door}`,
      type: ctx.request.body.type,
      enabled: ctx.request.body.is_enabled,
      timeout: ctx.request.body.timeout,
      relays
    }))

    ctx.status = 200
    ctx.body = {
      data: {
        id: addedLock.id,
        destination: addedLock.destination,
        type: addedLock.type,
        timeout: addedLock.timeout,
        is_enabled: addedLock.enabled,
        relays: addedLock.relays.map(it => ({
          id: it.id,
          direction: it.direction,
          gpio: it.gpio
        })),
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

    ctx.status = 204

    await next()
  }
}
