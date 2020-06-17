import { KoaController, Controller, Post, Validate, Validator } from 'koa-joi-controllers';
import { Service, Inject } from 'typedi';
import { getConnection } from 'typeorm';
import { LockEntity } from '@/database/entities/LockEntity';
import { AccessEntity } from '@/database/entities/AccessEntity';
import { Constants } from '@/utils/Constants';

@Service()
@Controller('/lock')
export class LockController extends KoaController {
  /**
   * @type {Array<import('@/managers/LockManager').LockManager>}
   */
  @Inject(Constants.RELAYS_MANAGERS)
  locksManagers

  /**
   * @private
   * @param {import('koa').Context} ctx
   * @param {import('koa').Next} next
   */
  @Post('/open')
  @Validate({
    type: 'json',
    body: {
      source: Validator.Joi
        .string()
        .required(),

      initiator: Validator.Joi
        .string()
        .required()
    }
  })
  async open (ctx, next) {
    const lock = await getConnection()
      .getRepository(LockEntity)
      .findOneOrFail({
        source: ctx.request.body.source
      })

    // Open lock
    await this.locksManagers
      .find(it => it.type == lock.type)
      ?.open(lock.locks, lock.timeout)

    // Logging entering
    const accessRepository = await getConnection()
      .getRepository(AccessEntity)

    const accessLogRecord = await accessRepository.save(accessRepository.create({
      source: ctx.request.body.source,
      initiator: ctx.request.body.initiator
    }))

    ctx.status = 200
    ctx.body = {
      source: ctx.request.body.source,
      initiator: ctx.request.body.initiator,
      timestamp: accessLogRecord.createdAt
    }

    await next()
  }
}
