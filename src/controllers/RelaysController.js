import { Controller, KoaController, Get, Post, Validate, Validator, Delete } from 'koa-joi-controllers';
import { Service } from 'typedi';
import { getConnection } from 'typeorm';
import { RelayEntity } from '@/db/entities/RelayEntity';

@Service()
@Controller('/api/relays')
export class RelaysController extends KoaController {
  /**
   * @private
   * @param {import('koa').Context} ctx
   * @param {import('koa').Next} next
   */
  @Get('/')
  async all (ctx, next) {
    const relays = await getConnection()
      .getRepository(RelayEntity)
      .find()

    ctx.status = 200
    ctx.body = {
      data: relays.map(it => ({
        id: it.id,
        gpio: it.gpio
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
      gpio: Validator.Joi
        .number()
        .required()
    }
  })
  async add (ctx, next) {
    const relaysRepository = getConnection().getRepository(RelayEntity)

    const relay = await relaysRepository.save(relaysRepository.create({
      gpio: ctx.request.body.gpio
    }))

    ctx.status = 200
    ctx.body = {
      data: {
        id: relay.id,
        gpio:relay.gpio
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
    const relaysRepository = getConnection().getRepository(RelayEntity)
    const relay = await relaysRepository.findOneOrFail(ctx.request.params.id)
    await relaysRepository.remove(relay)

    ctx.status = 204

    await next()
  }
}
