# rss cache for node 
A cache lib from nodejs. Can sync data between server or pm2 process.
 
## Install 
`npm install rss-cache` 
 
## Usuage 
 
### basic cache from cache a function result
```javascript 
const rssCache = new RssCache('mycache', 10 * 60 * 1000)
const key = 'cacheKey'
const value = rssCache.get(() => { return parseInt(Math.random(100) * 100) }, key)
```

### async cache for cache a promise
```javascript 
const rssCache = new RssCache('mycache', 10 * 60 * 1000)
const key = 'cacheKey'
const val = rssCache.get(new Promise((resolve) => {
  setTimeout(() => {
    resolve(parseInt(Math.random(100) * 100))
  }, 1000)
}), key)
val.then((value) => {
  res.write(`get key [${key}]: ${value}`);
  res.end();
})
```

### sync between servers with redis 
```javascript 
RssCache.initSync(new RssRedis({channel: 'RssCacheChannel', host: 'localhost'}))
```

## Examples 
you can try it with  
`npm install -g pm2`  
`rm -rf dist && npm run build && cd dist/examples && pm2 start demo.js -i 2`
then visist  
[http://localhost:6060/?key=b](http://localhost:6060/?key=b)  
[http://localhost:6060/?key=b&type=clear](http://localhost:6060/?key=b&type=clear)  
[http://localhost:6060/?key=b&sync=async](http://localhost:6060/?key=b)  
in your browser