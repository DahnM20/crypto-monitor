const request = require('supertest')
const app = require('../src/app')
const PerfSummary = require('../src/models/perfSummary')

const { populateDatabase } = require('./fixtures/db')

beforeEach(populateDatabase)

test('perf should be persisted', async () => {

    const perfOne = {
        asset: 'ethereum',
        week: '2022-03-14',
        value: 11,
        kind: 'wUSD',
        id: 1
    }

    await new PerfSummary(perfOne).save();

    const perfSummary = await PerfSummary.findOne();

    expect(perfSummary).not.toBeNull()
})

test('perf with incorrect kind should not be persisted', async () => {

    const perfOne = {
        asset: 'ethereum',
        week: '2022-03-14',
        value: 11,
        kind: 'incorrect',
        id: 1
    }

    try { 
        await new PerfSummary(perfOne).save();
    } catch(e){
        //doNothing
    } finally {
        const perfSummary = await PerfSummary.findOne();
        expect(perfSummary).toBeNull()
    }
})

test('Asset creation should create new perfSummary', async () => {

    const perfOne = {
        asset: 'ethereum',
        week: '2022-03-14',
        value: 11,
        kind: 'wUSD',
        id: 1
    }

    const perfTwo = {
        asset: 'ethereum',
        week: '2022-03-20',
        value: 22,
        kind: 'wUSD',
        id: 2
    }

    const expected = {
        asset: 'ethereum', '2022-03-14': 11, '2022-03-20' : 22
    }

    await new PerfSummary(perfOne).save()
    await new PerfSummary(perfTwo).save()

    const perfSummary = await PerfSummary.getAllSummaryForAsset('ethereum', '2');

    expect(perfSummary).not.toBeNull()
    expect(perfSummary).toStrictEqual(expected)
})