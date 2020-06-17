class App {
  /**
   * @public
   * @param {number} port
   */
  start (port) {
    // TODO (2020.06.17): Start controller's server
  }

  /**
   * @public
   */
  stop () {
    // TODO (2020.06.17): Stop controller's server
  }
}

function main () {
  const app = new App()

  process.on('SIGINT', app.stop)
  app.start(Number(process.env.PORT))
}

main()
