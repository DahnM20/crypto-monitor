const request = require('supertest')
const app = require('../src/app')
const Tx = require('../src/models/tx')

const { sampleAssetSolana, populateDatabase, assetOne } = require('./fixtures/db')

beforeEach(populateDatabase)

test('Asset creation should create new tx', async () => {

    await request(app).post('/wallet').send(sampleAssetSolana)
        .expect(200)

    const tx = await Tx.findOne({ asset: sampleAssetSolana.name })

    expect(tx).not.toBeNull()
    expect(tx.quantity).toBe(sampleAssetSolana.quantity)
    expect(tx.operation).toBe('add')
})

test('Empty update should not create new tx', async () => {

    const assetOneUpdate = {
        name: 'ethereum',
        quantity: assetOne.quantity
    }

    const response = await request(app).put('/wallet')
        .send(assetOneUpdate).expect(200)

    const txs = await Tx.find({ asset: assetOne.name })

    expect(txs.length).toBe(1)
})

test('Asset update (add) should create new tx', async () => {

    const assetOneUpdate = {
        name: 'ethereum',
        quantity: 10
    }

    const response = await request(app).put('/wallet')
        .send(assetOneUpdate).expect(200)

    const txs = await Tx.find({ asset: assetOne.name })

    expect(txs.length).toBe(2)
    expect(txs[1].quantity).toBe(assetOneUpdate.quantity - assetOne.quantity)
    expect(txs[1].operation).toBe('add')
})

test('Asset update (remove) should create new tx', async () => {

    const assetOneUpdate = {
        name: 'ethereum',
        quantity: 0
    }

    const response = await request(app).put('/wallet')
        .send(assetOneUpdate).expect(200)

    const txs = await Tx.find({ asset: assetOne.name })

    expect(txs.length).toBe(2)
    expect(txs[1].quantity).toBe(assetOneUpdate.quantity - assetOne.quantity)
    expect(txs[1].operation).toBe('remove')
})

test('Tx should all have different ids', async () => {

    const assetOneUpdateOne = {
        name: 'ethereum',
        quantity: 0
    }

    const assetOneUpdateTwo = {
        name: 'ethereum',
        quantity: 100
    }

    await request(app).put('/wallet')
        .send(assetOneUpdateOne).expect(200)

    await request(app).put('/wallet')
        .send(assetOneUpdateTwo).expect(200)

    const txs = await Tx.find({ asset: assetOne.name })

    expect(txs.length).toBe(3)

    const allIds = txs.map(({ id }) => {
        return id
    })
    uniqids = [...new Set(allIds)];

    expect(allIds.length).toBe(uniqids.length)
})