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
    this.koaApplication = new Koa()
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
}
