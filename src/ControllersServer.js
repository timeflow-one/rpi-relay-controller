import Koa from 'koa'
import { Service, Inject } from 'typedi'
import { Logger } from './utils/Logger'
import { configureRoutes, KoaController } from 'koa-joi-controllers'
import { Constants } from './utils/Constants'

@Service()
export class ControllersServer {
  /**
   * @private
   * @type {Array<KoaController>}
   */
  @Inject(Constants.CONTROLLERS)
  controllers

  /**
   * @private
   * @type {import('http').Server}
   */
  server

  /**
   * @protected
   * @type {Koa}
   */
  koaApplication

  /**
   * @public
   */
  async init () {
    this.initKoaApplication()
    configureRoutes(this.koaApplication, this.controllers)
  }

  /**
   * @public
   * @param {number} port
   */
  async start (port) {
    this.server = this.koaApplication
      .listen(port, () => Logger.info(ControllersServer.name, `Server starting on port ${port}`))
  }

  /**
   * @public
   */
  async stop () {
    if (this.server && this.server.listening)
      this.server.close((err) => Logger.info(ControllersServer.name, `Server has been stop, err: ${err}`))
    else
      Logger.info(ControllersServer.name, 'Server already stopped or was not running')
  }

  /**
   * @private
   */
  initKoaApplication () {
    this.koaApplication = new Koa()
    // error codes middleware
    this.koaApplication.use((ctx, next) => next().catch((err) => {
      if (!err.status) {
        switch (err.name) {
          case 'ValidationError':
          case 'QueryFailedError':
            err.status = 400;
            break;

          default:
            err.status = 500;
        }
      }

      ctx.app.emit('error', err, ctx)
    }))
    // error handler event
    this.koaApplication.on('error', (err, ctx) => {
      ctx.status = err.status || 500
      ctx.body = {
        title: err.name,
        detail: err.detail || err.msg || err.message || 'Internal Server Error'
      }
    })
  }
}
