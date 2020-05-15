const Config = require('./config')
const client = require('./client')
const createSdk = require('./sdk')
module.exports = {
  createSdk, Config,
  mock: client.mock
}