const request = require('supertest')
const mongoose = require('mongoose')
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

test('Asset update (add) should create new tx', async () => {

    const assetOneUpdate = {
        name:'ethereum',
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
        name:'ethereum',
        quantity: 0
    }

    const response = await request(app).put('/wallet')
        .send(assetOneUpdate).expect(200)

    const txs = await Tx.find({ asset: assetOne.name })

    expect(txs.length).toBe(2)
    expect(txs[1].quantity).toBe(assetOneUpdate.quantity - assetOne.quantity)
    expect(txs[1].operation).toBe('remove')
})