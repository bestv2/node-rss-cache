export type rssPubFunc = (channel: string, opt: object) => {}
export type rssSubFunc = (channel: string, cb: any) => {}
export default interface RssConfig {
  publish: rssPubFunc
  onMessage: rssSubFunc
  channel: string
}