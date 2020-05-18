const express = require('express')
const balancer = require('./load-balancer')
const axios = require('axios')

const app = express()

balancer.config([{
  path: '/api',
  service: 'api-service'
}, {
  path: '/webapp',
  service: 'webapp-service'
}])

app.get('/api', balancer.loadBalancer, async (req, res) => {
  const data = await axios.get(`${req.header('x-base-url')}/service`)
  res.send(`${data.data} from ${req.header('x-base-url')}`)
})

app.get('/webapp', balancer.loadBalancer, async (req, res) => {
  const data = await axios.get(`${req.header('x-base-url')}/service`)
  res.send(`${data.data} from ${req.header('x-base-url')}`)
})

app.listen(5001, () => {
  console.log(`Server running on port: ${5001}`)
})