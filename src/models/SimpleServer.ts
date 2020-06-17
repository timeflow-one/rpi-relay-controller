export interface SimpleServer {
  init (): Promise<any>
  start (port: number): Promise<any>
  stop (): Promise<any>
}
