const fileStore = require('../lib/stores/file')
const memoStore = require('../lib/stores/memo')
const createStore = require('../lib/stores')

jest.mock('../lib/stores/file', () => jest.fn(() => 'file store'))
jest.mock('../lib/stores/memo', () => jest.fn(() => 'memo store'))

describe('create store', () => {
  afterEach(() => {
    fileStore.mockClear()
    memoStore.mockClear()
  })

  it('should create particular store', () => {
    const store = createStore('file', 'file.json')
    expect(store).toEqual('file store')
    expect(fileStore).toHaveBeenCalledWith('file.json')
    expect(memoStore).not.toHaveBeenCalled()
  })

  it('should create particular store', () => {
    const store = createStore('memo', 'init')
    expect(store).toEqual('memo store')
    expect(memoStore).toHaveBeenCalledWith('init')
    expect(fileStore).not.toHaveBeenCalled()
  })

  it('should create memo store by default', () => {
    const store = createStore('unknown', {})
    expect(store).toEqual('memo store')
  })

  it('should not create duplicated store', () => {
    createStore('file', 'file.json')
    createStore('file', 'file.json')
    createStore('file', 'file.json')
    expect(fileStore).not.toHaveBeenCalled()
  })
})