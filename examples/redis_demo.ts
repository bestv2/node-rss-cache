import Server from './server'
import RssRedis from '../src/rss/Redis'
import RssCache from '../src/index'

RssCache.initSync(new RssRedis({ channel: 'RssCacheChannel', host: 'localhost' }))

new Server(6060)