const app = require('../src/app')
const WalletValue = require('../src/models/walletValue')
const {computeWalletValue} = require('../src/wallet-processor')

const { populateDatabase, sampleWalletValue } = require('./fixtures/db')

beforeEach(populateDatabase)

test('Should compute and save wallet value', async () => {
    let values = await WalletValue.find({})
    expect(values.length).toBe(0)

    await computeWalletValue()

    values = await WalletValue.find({})
    expect(values.length).toBe(1)
})


test('Values should have different ids', async () => {
    let values = await WalletValue.find({})
    expect(values.length).toBe(0)

    await computeWalletValue()
    await computeWalletValue()

    values = await WalletValue.find({})
    expect(values.length).toBe(2)

    expect(values[0].id).not.toBe(values[1].id)
})

test('Values should have different dates', async () => {
    let values = await WalletValue.find({})
    expect(values.length).toBe(0)

    await computeWalletValue()
    await new Promise(resolve => setTimeout(resolve, 1000));
    await computeWalletValue()

    values = await WalletValue.find({})
    expect(values.length).toBe(2)

    expect(values[0].date).not.toBe(values[1].date)
})