const request = require('supertest')
const app = require('../src/app')
const WalletAsset = require('../src/models/walletAsset')
const { assetOne, assetTwo, sampleAssetSolana, populateDatabase } = require('./fixtures/db')

beforeEach(populateDatabase)

test('Should return both assets created before each tests', async () => {
    const response = await request(app).get('/wallet').expect(200)

    const assets = response.body
    expect(assets).not.toBeNull()

    expect(assets[0]).toMatchObject(assetOne)
    expect(assets[1]).toMatchObject(assetTwo)
})


test('Should create new asset', async () => {

    const response = await request(app).post('/wallet')
        .send(sampleAssetSolana).expect(200)

    const dbAsset = await WalletAsset.findOne({ name: sampleAssetSolana.name })
    expect(dbAsset).toMatchObject(sampleAssetSolana)
})

test('Should update asset quantity', async () => {
    const assetOneUpdate = {
        name:'ethereum',
        quantity: 10
    }

    const response = await request(app).put('/wallet')
        .send(assetOneUpdate).expect(200)

    const dbAsset = await WalletAsset.findOne({ name: assetOneUpdate.name})
    expect(dbAsset.quantity).toBe(assetOneUpdate.quantity)
})