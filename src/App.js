import 'reflect-metadata'
import Container, { Inject, Service } from 'typedi'
import { ControllersServer } from './ControllersServer'
import { Constants } from './utils/Constants'
import { LockController } from './controllers/LockController'
import Lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

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

/**
 * @typedef {object} DatabaseSchema
 * @property {Array<import('./models/LockModel').LockModel>} relays
 * @property {Array<import('./models/AccessModel').AccessModel>} access
 *
 * @param {string} path path to database file
 *
 * @returns {import('lowdb').LowdbSync<DatabaseSchema>}
 */
function initDatabase (path) {
  const adapter = new FileSync(path)
  /**
   * @type {import('lowdb').LowdbSync<DatabaseSchema>}
   */
  const db = Lowdb(adapter)
  /**
   * @type {DatabaseSchema}
   */
  const dbSchema = {
    relays: [],
    access: []
  }

  if (db.isEmpty()) {
    // init default shema
    db
      .defaults(dbSchema)
      .write()
  }

  return db
}

async function main () {
  // Database
  Container.set(Constants.DATABASE, initDatabase(String(process.env.DB_PATH)))
  // Koa controllers list
  Container.set(Constants.CONTROLLERS, [
    Container.get(LockController)
  ])

  const app = Container.get(App)

  process.on('SIGINT', () => app.stop())
  await app.init()
  await app.start(Number(process.env.PORT))
}

main()
