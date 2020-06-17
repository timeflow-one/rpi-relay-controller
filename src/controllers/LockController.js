import { KoaController, Controller, Post, Validate, Validator } from 'koa-joi-controllers';
import { Service, Inject } from 'typedi';
import Lowdb from 'lowdb'
import { Constants } from '@/utils/Constants';

@Service()
@Controller('/lock')
export class LockController extends KoaController {
  /**
   * @private
   * @type {Lowdb.LowdbSync<any>}
   */
  @Inject(Constants.DATABASE)
  db

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
        .required()
    }
  })
  async open (ctx, next) {
    const source = ctx.request.body.source
    // TODO (2020.06.17): Find controller
    // const controller = ""
  }
}
