import { KoaController, Controller, Post, Validate, Validator } from 'koa-joi-controllers';
import { Service, Inject } from 'typedi';
import { getConnection } from 'typeorm';
import { LockEntity } from '@/db/entities/LockEntity';
import { AccessEntity } from '@/db/entities/AccessEntity';
import { Constants } from '@/utils/Constants';
import { ConfigureException } from '@/exceptions/ConfigureException';

@Service()
@Controller('/lock')
export class LockController extends KoaController {
  /**
   * @type {Array<import('@/managers/LockManager').LockManager>}
   */
  @Inject(Constants.LOCKS_MANAGERS)
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
        destination: ctx.request.body.source,
        enabled: true
      })

    // Open lock
    const lockManager = this.locksManagers.find(it => it.type == lock.type)

    if (!lockManager)
      throw new ConfigureException(`Missing manager for '${lock.type}' lock`)

    await lockManager.open(lock, lock.timeout)

    // Logging entering
    const accessRepository = await getConnection()
      .getRepository(AccessEntity)

    const accessLogRecord = await accessRepository.save(accessRepository.create({
      destination: ctx.request.body.source,
      initiator: ctx.request.body.initiator
    }))

    ctx.status = 200
    ctx.body = {
      data: {
        source: ctx.request.body.source,
        initiator: ctx.request.body.initiator,
        timestamp: accessLogRecord.createdAt
      }
    }

    await next()
  }
}
