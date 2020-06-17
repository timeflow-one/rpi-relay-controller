import 'reflect-metadata'
import Container, { Inject, Service } from 'typedi'
import { ControllersServer } from './ControllersServer'
import { Constants } from './utils/Constants'
import { LockController } from './controllers/LockController'

@Service()
class App {
  /**
   * @private
   * @type {import('./models/SimpleServer').SimpleServer}
   */
  @Inject(() => ControllersServer)
  server

  /**
   * @public
   */
  async init () {
    this.server.init()
  }

  /**
   * @public
   * @param {number} port
   */
  async start (port) {
    this.server.start(port)
  }

  /**
   * @public
   */
  async stop () {
    this.server.stop()
  }
}

async function main () {
  Container.set(Constants.CONTROLLERS, [
    Container.get(LockController)
  ])

  const app = Container.get(App)

  process.on('SIGINT', () => app.stop())
  await app.init()
  await app.start(Number(process.env.PORT))
}

main()
