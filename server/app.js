const http = require('http')
const pid = process.pid
const consul = require('consul')()
const portFinder = require('portfinder')
const serviceType = process.argv[2]
const express = require('express')
const app = express()

app.get('/service', (req, res) => {
  res.send('Hello World!')
})

portFinder.getPort((err, port) => {
  const serviceId = serviceType + port
  consul.agent.service.register({
    id: serviceId,
    name: serviceType,
    address: 'localhost',
    port: port,
    tags: [serviceType]
  }, () => {
    const unregisterService = (err) => {
      consul.agent.service.deregister(serviceId, () => {
        process.exit(err ? 1 : 0)
      })
    }

    process.on('exit', unregisterService)
    process.on('SIGINT', unregisterService)
    process.on('uncaughtException', unregisterService)

    http.createServer(app).listen(port, () => {
      console.log(`Started ${serviceType} (${pid}) on port ${port}`)
    })
  })
})