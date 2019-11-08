const http = require('http')
const urlLib = require('url')
const fs = require('fs')
// const querystring = require('qureystring')

import RssCache from '../src/index'

class Server {
  constructor(port) {
    const rssCache = new RssCache('mycache', 10 * 60 * 1000)
    console.log(`server strat on : ${port}`)
    var server = http.createServer(function (req, res) {
      //解析数据
      var str = ""
      req.on('data', function (data) {
        str += data
      })
      req.on('end', function () {
        var obj = urlLib.parse(req.url, true)
        const GET = obj.query
        // const POST = querystring.parse(str)
        const key = GET.key
        console.log(`params: ${JSON.stringify(GET)}`)
        if (key) {
          const type = GET.type
          const async = GET.sync === 'async'
          try {
            if (type === 'clear') {
              rssCache.clear(key)
              res.write(`clear key ${key}`)
              res.end()
            } else if (async) {
              const val = rssCache.get(new Promise((resolve) => {
                setTimeout(() => {
                  resolve(parseInt(Math.random(100) * 100))
                }, 1000)
              }), key)
              val.then((value) => {
                res.write(`get key [${key}]: ${value}`)
                res.end()
              })
            } else {
              const value = rssCache.get(() => { return parseInt(Math.random(100) * 100) }, key)
              res.write(`get key [${key}]: ${value}`)
              res.end()
            }
          } catch (e) {
            console.log(e)
          }
        } else {
          res.write('hellow world')
          res.end()
        }
        // const num = )
        // this.rssCache.get(() => { return num + 10}, `${num}`)
        // console.log('get' + )
        // console.log(POST)

      })
    })
    server.listen(port)
  }
}
export default Server