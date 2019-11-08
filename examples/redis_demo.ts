import Server from './server'
import RssCache, { rss } from '../src/index'

RssCache.initSync(new rss.RedisRss({ channel: 'RssCacheChannel', host: 'localhost' }))

new Server(6060)