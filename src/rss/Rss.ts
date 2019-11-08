export type rssPubFunc = (channel: string, opt: object) => {}
export type rssSubFunc = (channel: string, cb: any) => {}
export interface Rss {
  publish: rssPubFunc
  onMessage: rssSubFunc
  channel: string
}
export type RssConfig = {
  channel: string
  host?: string
  port?: number
}