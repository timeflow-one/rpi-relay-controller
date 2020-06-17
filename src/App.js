import 'reflect-metadata'
import Container from 'typedi'
import { ControllersServer } from './ControllersServer'

class App {
  /**
   * @private
   * @type {import('./models/SimpleServer').SimpleServer}
   */
  server

  constructor () {
    this.server = Container.get(ControllersServer)
  }

  /**
   * @public
   * @param {number} port
   */
  start (port) {
    this.server.start(port)
  }

  /**
   * @public
   */
  stop () {
    this.server.stop()
  }
}

function main () {
  const app = new App()

  process.on('SIGINT', app.stop)
  app.start(Number(process.env.PORT))
}

main()
