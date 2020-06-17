import Koa from 'koa'
import { Service } from 'typedi'
import { Logger } from './utils/Logger'
import { configureRoutes } from 'koa-joi-controllers'
import { LockController } from './controllers/LockController'

@Service()
export class ControllersServer {
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

  constructor () {
    this.koaApplication = new Koa()
    configureRoutes(this.koaApplication, [
      new LockController()
    ], '/api')
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
    if (this.server)
      this.server.close((err) => Logger.info(ControllersServer.name, `Server has been stop, err: ${err}`))
    else
      Logger.info(ControllersServer.name, 'Server already stopped or was not running')
  }
}
