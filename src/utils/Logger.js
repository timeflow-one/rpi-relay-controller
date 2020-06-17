export class Logger {
  /**
   * @param {string} tag
   * @param {string} message
   */
  static info (tag, message) {
    console.info(`[${new Date().toLocaleString()}] [INFO]: [${tag}] ${message}`);
  }

  /**
   * @param {string} tag
   * @param {string | Error} error
   */
  static error (tag, error) {
    console.error(`[${new Date().toLocaleString()}] [ERROR]: [${tag}] ${error}`);
  }

  /**
   * @param {string} tag
   * @param {string | Error} error
   */
  static debug (tag, error) {
    console.debug(`[${new Date().toLocaleString()}] [DEBUG]: [${tag}] ${error}`);
  }
}
