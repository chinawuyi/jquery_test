var express = require('express')
var proxy = require('http-proxy-middleware')
var pkg = require('./package.json')

var app = express()
var proxyCfg = pkg.proxy
app.use(express.static(pkg.dist))
for (var key in proxyCfg) {
  app.use(key, proxy(proxyCfg[key]))
}

app.listen(8121)
