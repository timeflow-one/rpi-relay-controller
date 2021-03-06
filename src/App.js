import 'reflect-metadata'
import Container, { Inject, Service } from 'typedi'
import { ControllersServer } from './ControllersServer'
import { Constants } from './utils/Constants'
import { LockController } from './controllers/LockController'
import { createConnection } from 'typeorm'
import { DirectLockManager } from './managers/DirectLockManager'
import { LocksController } from './controllers/LocksController'
import { RelaysController } from './controllers/RelaysController'
import { initLocks } from './utils/LocksUtil'
import { RelayManager } from './managers/RelayManager'
import { CompositeLockManager } from './managers/CompositeLockManager'

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
  // create connection to database
  await createConnection()
  Container.set(Constants.ELECTROMOTOR_TURN_TIMEOUT, Number(process.env.ELECTROMOTOR_TURN_TIMEOUT || 500))
  // lock managers
  Container.set(Constants.LOCKS_MANAGERS, [
    Container.get(DirectLockManager),
    Container.get(CompositeLockManager)
  ])
  // koa controllers list
  Container.set(Constants.CONTROLLERS, [
    Container.get(LockController),
    Container.get(LocksController),
    Container.get(RelaysController)
  ])
  // init locks
  await initLocks(Container.get(RelayManager))

  const app = Container.get(App)
  process.on('SIGINT', () => app.stop())
  await app.init()
  await app.start(Number(process.env.PORT))
}

main()
