export interface SimpleServer {
  start (port: number): Promise<any>
  stop (): Promise<any>
}
