declare type KeySecretPair = {
  key: string
  secret: string
}

declare type ConfigOptions = {
  cors?: string[]
  cache?: object
  realms?: KeySecretPair[]
  apps: KeySecretPair[]
}

declare type ConfigData = {
  appId: string
  timestamp: number
  nonceStr: string
  signature: string
  [property: string]: any
}

export function Config(options: ConfigOptions): Config
export class Config {
  constructor(options: ConfigOptions)
  static load(file: string): Config
  apps: KeySecretPair[]
  realms: KeySecretPair[]
  getApp(key: string): KeySecretPair
  getRealm(key: string): KeySecretPair
  isAllowedOrigin(origin: string): boolean
}

export function Sdk(config: Config): Sdk
export class Sdk {
  constructor(config: Config)
  getAccessToken(appKey: string, appSecret: string): Promise<string>
  getTicket(appKey: string, appSecret: string): Promise<string>
  createConfig(appKey: string, appSecret: string, params?: object): Promise<ConfigData>
  verifyRealmSign(realmKey: string, payload: string, sign: string): boolean
}

export function mock(): () => void