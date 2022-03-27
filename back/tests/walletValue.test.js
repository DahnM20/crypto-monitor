const request = require('supertest')
const app = require('../src/app')
const WalletValue = require('../src/models/walletValue')

const { populateDatabase, sampleWalletValue } = require('./fixtures/db')

beforeEach(populateDatabase)

test('Should return both assets created before each tests', async () => {
    const response = await request(app).get('/wallet').expect(200)
})