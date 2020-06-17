import { KoaController, Controller, Post } from 'koa-joi-controllers';
import { Service } from 'typedi';

@Service()
@Controller('/lock')
export class LockController extends KoaController {
  /**
   * @private
   * @param {import('koa').Context} ctx
   * @param {import('koa').Next} next
   */
  @Post('/open')
  async open (ctx, next) {

  }
}
