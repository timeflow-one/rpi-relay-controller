import 'reflect-metadata'
import Container, { Inject, Service } from 'typedi'
import { ControllersServer } from './ControllersServer'
import { Constants } from './utils/Constants'
import { LockController } from './controllers/LockController'
import { createConnection } from 'typeorm'
import { ElectromagneticLockManager } from './managers/ElectromagneticLockManager'

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

async function initRelays () {
  // TODO (2020.06.17): Init all gpio before use relays
  throw new Error('Not implemented')
}

async function main () {
  // create connection to database
  await createConnection()
  // lock managers
  Container.set(Constants.RELAYS_MANAGERS, [
    Container.get(ElectromagneticLockManager)
  ])
  // koa controllers list
  Container.set(Constants.CONTROLLERS, [
    Container.get(LockController)
  ])

  const app = Container.get(App)

  process.on('SIGINT', () => app.stop())
  await app.init()
  await app.start(Number(process.env.PORT))
}

main()
