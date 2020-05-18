const consul = require('consul')()

let routing

exports.config = (configs) => {
  configs = configs.map(config => {
    config = { ...config, index: 0 }
    return config
  })
  routing = configs
}

exports.loadBalancer = (req, res, next) => {
  let route
  routing.some(entry => {
    route = entry
    return req.url.indexOf(route.path) === 0
  })

  consul.agent.service.list((err, services) => {
    if (err) {
      res.writeHead(500)
      return res.end('Internal server error')
    }

    const servers = []
    Object.keys(services).filter(id => {
      if (services[id].Tags.indexOf(route.service) > -1) {
        servers.push(`http://${services[id].Address}:${services[id].Port}`)
      }
    })

    if (!servers.length) {
      res.writeHead(502)
      return res.end('Bad gateway')
    }

    route.index = (route.index + 1) % servers.length
    req.headers['x-base-url'] = servers[route.index]
    next()
  })
}