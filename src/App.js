import 'reflect-metadata'
import Container, { Inject, Service } from 'typedi'
import { ControllersServer } from './ControllersServer'
import { Constants } from './utils/Constants'
import { LockController } from './controllers/LockController'
import { createConnection, getConnection } from 'typeorm'
import { DirectLockManager } from './managers/DirectLockManager'
import { LockEntity } from './db/entities/LockEntity'
import { LockManager } from './managers/LockManager'
import { ConfigureException } from './exceptions/ConfigureException'
import { ApiController } from './controllers/ApiController'

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

async function initLocks () {
  const connection = getConnection()
  /** @type {Array<LockManager>} */
  const locksManagers = Container.get(Constants.LOCKS_MANAGERS)
  const locks = await connection.getRepository(LockEntity)
    .find()

  for (let lock of locks) {
    const lockManager = locksManagers.find(it => it.type == lock.type)

    if (!lockManager)
      throw new ConfigureException(`Missing manager for '${lock.type}' lock`)

    await lockManager.init(lock)
  }
}

async function main () {
  // create connection to database
  await createConnection()
  // lock managers
  Container.set(Constants.LOCKS_MANAGERS, [
    Container.get(DirectLockManager)
  ])
  // koa controllers list
  Container.set(Constants.CONTROLLERS, [
    Container.get(LockController),
    Container.get(ApiController)
  ])
  // init locks
  // await initLocks()

  const app = Container.get(App)
  process.on('SIGINT', () => app.stop())
  await app.init()
  await app.start(Number(process.env.PORT))
}

main()
