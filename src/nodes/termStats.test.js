import _ from 'lodash/fp'
import terms_stats from './terms_stats'

describe('terms_stats', () => {
  let defaultTree = {
    key: 'root',
    children: [
      {
        key: 'terms',
        type: 'terms_stats',
      },
      {
        key: 'results',
        type: 'results',
      },
    ],
  }

  let simpleRecords = ['record1', 'record2', 'record3']

  let getSimpleService = () =>
    jest.fn(tree => {
      _.last(tree.children).context = {
        terms: simpleRecords,
        value: 1337,
      }
      return tree
    })

  let prepareSimpleStrategy = async (strategyParams = {}) => {
    let service = getSimpleService()
    let tree = _.cloneDeep(defaultTree)
    let strategy = await terms_stats({
      service,
      tree,
      ...strategyParams,
    })
    return strategy
  }

  it('retrieves the total records (same as the given size)', async () => {
    let strategy = await prepareSimpleStrategy({ size: 1337 })
    expect(strategy.getTotalRecords()).toBe(1337)
  })
  it('retrieves records with next', async () => {
    let strategy = await prepareSimpleStrategy()
    let arr = []
    for await (const i of strategy) arr.push(i)
    expect(arr).toEqual([simpleRecords])
  })
})