const crypto = require('crypto')
const createStore = require('./stores')
const createCache = require('./caches')
const client = require('./client')

const isString = s => 'string' === typeof s && s.trim() !== ''

async function getTokenWithCache(appId, appSecret, cache) {
  const token_key = `${appId}.token`
  let token = await cache.get(token_key)
  if(token) {
    return token
  }
  token = await client.requestAccessToken(appId, appSecret)
  if(token) {
    await cache.put(token_key, token.access_token, token.expires_in)
    return token.access_token
  }
}

async function getTicketWithCache(appId, appSecret, cache){
  const ticket_key = `${appId}.ticket`
  let ticket = await cache.get(ticket_key)
  if(ticket) {
    return ticket
  }
  const token = await getTokenWithCache(appId, appSecret, cache)
  ticket = await client.requestTicket(token)
  if(ticket) {
    await cache.put(ticket_key, ticket.ticket, ticket.expires_in)
    return ticket.ticket
  }
}

module.exports = function Sdk(config) {
  if(!(this instanceof Sdk)) {
    return new Sdk(config)
  }
  
  const {type, options} = config.cache
  let cache = null
  switch (type) {
  case 'redis': // redis cache
    cache = createCache('redis', options)
    break
  default: // local cache
    cache = createCache(type, createStore(type, options))
    break
  }

  if(!cache) {
    throw new Error('failed to init cache from config file')
  }
  
  return {
    async getAccessToken(appId, appSecret) {
      return await getTokenWithCache(appId, appSecret, cache)
    },

    async getTicket(appId, appSecret) {
      return await getTicketWithCache(appId, appSecret, cache)
    },

    async createConfig(appId, appSecret, params) {
      const options = Object.assign({}, params)
      const jsapi_ticket = await getTicketWithCache(appId, appSecret, cache)
      const timestamp = Math.floor(Date.now()/1000)
      const noncestr = crypto.randomBytes(16).toString('hex')
      const data = {jsapi_ticket, noncestr, timestamp, url: options.url}
      const candidate = Object.keys(data).sort().map(k=>`${k}=${data[k]}`).join('&')
      const signature = crypto.createHash('sha1').update(candidate).digest('hex')
      return {...options, appId, timestamp, nonceStr: noncestr, signature}
    },

    verifyRealmSign(key, payload, sign) {
      if(!isString(key) || !isString(payload) || !isString(sign)) {
        return false
      }
      const realm = config.getRealm(key)
      if(!realm) {
        return false
      }
      const result = crypto.createHash('md5').update(`${payload}.${realm.secret}`).digest('hex')
      return result === sign
    }
  }
}
