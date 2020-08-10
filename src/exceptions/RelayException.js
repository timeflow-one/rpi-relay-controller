export class RelayException extends Error {
  /**
   * @param {string | undefined} message
   */
  constructor (message) {
    super(message);
    this.name = 'RelayException'
    this.status = 500
  }
}
