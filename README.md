# wechat's media platform jssdk utilities

[![Travis](https://img.shields.io/travis/xixilive/jssdk/master)](https://travis-ci.org/github/xixilive/jssdk)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@ultramedia/jssdk)](https://www.npmjs.com/package/@ultramedia/jssdk)
[![npm version](https://img.shields.io/npm/v/@ultramedia/jssdk)](https://www.npmjs.com/package/@ultramedia/jssdk)
[![Known Vulnerabilities](https://snyk.io/test/github/xixilive/jssdk/badge.svg)](https://snyk.io/test/github/xixilive/jssdk)
[![NPM license](https://img.shields.io/npm/l/@ultramedia/jssdk)](https://www.npmjs.com/package/@ultramedia/jssdk)

## Installation

```
npm i @ultramedia/jssdk
```

## Usage

```js
// express
const app = require('express')()
const {Sdk, Config} = require('@ultramedia/jssdk')

const config = Config({
  apps: [{key: 'app id', secret: 'app secret'}]
})

const sdk = Sdk(config)

app.post('/config/:appid', (req, res, next) => {
  const {appid} = req.params
  const {key, secret} = config.getApp(appid)
  sdk.createConfig(key, secret).then(data => res.json(data))
})
```

## mock for testing

```js
const {mock} = require('@ultramedia/jssdk')

describe('suite', () => {
  let unmock;
  beforeAll(() => {
    unmock = mock()
  })
  afterAll(() => {
    unmock()
  })

  it('test', () => {
    console.log('all http requests for wechat server will be mocked')
  })
})
```

mock data:

```js
// when fetch access_token from wechat's server, mock response will be:
{access_token: 'access_token', expires_in: 7200}

// when fetch ticket from wechat's server, mock response will be:
{ticket: 'ticket', expires_in: 7200}
```

## API

```js
const {Config, Sdk, mock} = require('@ultramedia/jssdk')
```

Types declaration in: [`index.d.ts`](index.d.ts)

## Changes

### v0.1.x

- add typescript declaration file.
- rename `createSdk` to `Sdk` from exports. (break change)