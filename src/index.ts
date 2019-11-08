import { v4 as uuidv4 } from 'uuid'
import RssConfig from './rss/RssConfig'

export interface Cached {
  time: number,
  data: Promise<object> | object
}

export enum RssType {
  CLEAR = 'clear',
  SET = 'SET',
}

const isPormiseLike: Function = (fn: any) => {
  return !!(fn.then && fn.catch)
}


const RSS_ALL_CACHES: Map<string, RssCache> = new Map()

class RssCache {
  cacheName: string
  expire: number
  stores: Object
  uuid: string
  broadcast: any
  public static initSync(opt: RssConfig) {
    const { publish, onMessage, channel } = opt
    if (publish && onMessage && channel) {
      RssCache.prototype.broadcast = (type, cacheName, key, record = null) => {
        const instance: RssCache = RSS_ALL_CACHES[cacheName]
        publish(channel, { cacheName, key, type, uuid: instance.uuid, record })
      }
      onMessage(channel, ({ cacheName, key, type, uuid, record }) => {
        console.log(`onMessage: ${cacheName}, ${key}, ${type}, ${uuid}`)
        const instance: RssCache = RSS_ALL_CACHES[cacheName]
        if (instance.uuid !== uuid) {
          switch (type) {
            case RssType.CLEAR:
              instance.clear(key, false)
              break
            case RssType.SET:
              instance.setRecord(key, record, false)
              break
            default:
              console.log(`not support type ${type}`)
          }
        }
      })
    }
  }
  constructor(cacheName: string, expire: number = 10 * 60 * 1000) {
    this.cacheName = cacheName
    this.expire = expire
    this.stores = {}
    this.uuid = uuidv4()
    console.debug(`start uuid: ${this.uuid}`)
    RSS_ALL_CACHES[cacheName] = this
  }
  setRecord(key: string, record, needBroadcast = true) {
    this.stores[key] = record
    if (needBroadcast && this.broadcast) this.broadcast(RssType.SET, this.cacheName, key, record)
  }
  get(fn: any, key: string, needBroadcast = true): any {
    console.debug(`get from uuid: ${this.uuid}`)
    const cached: Cached = this.stores[key]
    const now = new Date().getTime()
    const isPromise: boolean = isPormiseLike(fn)
    if (this.expire > 0 && cached && now - cached.time <= this.expire) {
      console.debug('cached:', JSON.stringify(cached.data))
      return (isPromise ? Promise.resolve(cached.data) : cached.data)
    }
    if (isPormiseLike(fn)) {
      return fn.then((data) => {
        console.debug('new cache, promise:', JSON.stringify(data))
        // this.stores[key] = {
        //   time: now,
        //   data,
        // }
        this.setRecord(key, {
          time: now,
          data,
        }, needBroadcast)
        return data
      })

    } else {
      const data = fn()
      console.debug('new cache, function:', JSON.stringify(data))
      // this.stores[key] = {
      //   time: now,
      //   data: data,
      // }
      this.setRecord(key, {
        time: now,
        data,
      }, needBroadcast)
      return data
    }
  }
  clear(key: string, needBroadcast = true) {
    console.log(`clear ${!!this.stores[key] ? '' : 'no '}cached`, key)
    delete this.stores[key]
    if (needBroadcast && this.broadcast) this.broadcast(RssType.CLEAR, this.cacheName, key)
  }
}
export default RssCache