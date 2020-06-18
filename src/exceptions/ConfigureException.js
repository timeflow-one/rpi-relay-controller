export class ConfigureException extends Error {
  /**
   * @param {string | undefined} message
   */
  constructor (message) {
    super(message);
    this.name = 'ConfigureException'
    this.status = 501
  }
}
