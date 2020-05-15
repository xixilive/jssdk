# wechat's media platform jssdk utilities

## Installation

```
npm i @xixilvie/jssdk
```

## Usage

```js
// express
const app = require('express')()
const {createSdk, Config} = require('@xixilvie/jssdk')

const config = Config({
  apps: [{key: 'app id', secret: 'app secret'}]
})

const sdk = createSdk(config)

app.post('/config/:appid', (req, res, next) => {
  const {appid} = req.params
  const {key, secret} = config.getApp(appid)
  sdk.createConfig(key, secret).then(data => res.json(data))
})
```

## API

```ts
interface KeyScretPair {
  key: string;
  secret: string;
}

interface Cache {
  type: 'redis' | 'file' | 'memo';
  options: any;
}

interface ConfigData {
  cors?: string[];
  cache?: any;
  realms?: KeyScretPair;
  apps: KeyScretPair;
}

interface ConfigResponse {
  appId: string;
  timestamp: number;
  nonceStr: string;
  signature: string;
  [property: string]?: any;
}

class Config {
  static load(file:string): Config;
  constructor(data: ConfigData);
  get apps: KeyScretPair[];
  realms: KeyScretPair[];
  cache: Cache;
  getApp(key: string): KeyScretPair;
  getRealm(key: string): KeyScretPair;
  isAllowedOrigin(origin: string): bool;
}

class Sdk {
  constructor(config: Config);
  getAccessToken(key: string, secret: string): Promise<any>;
  getAccessTicket(key: string, secret: string): Promise<any>;
  verifyRealmSign(key: string, payload: string, sign: string): bool;
  createConfig(key: string, secret: string, params: any): Promise<ConfigResponse>;
}
```
