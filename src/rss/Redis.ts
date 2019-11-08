import Redis from 'ioredis'
import RssConfig from './RssConfig'
export default class RedisRss implements RssConfig {
  config: Object
  consumer
  producer
  channel
  constructor(config) {
    this.config = config
    const { channel, ...redisConfig } = config
    try {
      this.consumer = new Redis(redisConfig)
      this.producer = new Redis(redisConfig)
    } catch (e) {
      console.error(e)
    }
    this.channel = channel
  }
  publish = (channel: string, opt: object): any => {
    this.producer.publish(channel, JSON.stringify(opt))
  }
  onMessage = (channel: string, cb: any): any => {
    this.consumer.subscribe(channel)
    this.consumer.on("message", (channel, message) => {
      try {
        cb(JSON.parse(message))
      } catch(e) {
        console.warn(`redis on message err, channel: ${channel}`, message)
      }
    })
  }
}