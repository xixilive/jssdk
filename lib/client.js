const fetch = require('node-fetch')
const BASE = 'https://api.weixin.qq.com/cgi-bin'

const mock = {
  enable: false,
  data: {
    token: {access_token: 'access_token', expires_in: 7200},
    ticket: {ticket: 'ticket', expires_in: 7200}
  }
}

const fetchUrl = async (url, key) => {
  if(mock.enable) {
    return mock.data[key]
  }
  return await fetch(url).then(res => res.json())
}

async function requestAccessToken(appId, appSecret){
  const url = `${BASE}/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`
  const res = await fetchUrl(url, 'token')
  return res && res.access_token ? res : Promise.reject(res)
}

async function requestTicket(accessToken){
  const url = `${BASE}/ticket/getticket?access_token=${accessToken}&type=jsapi`
  const res = await fetchUrl(url, 'ticket')
  return res && res.ticket ? res : Promise.reject(res)
}

module.exports = {
  requestAccessToken,
  requestTicket
}

module.exports.mock = () => {
  mock.enable = true
  return () => mock.enable = false
}