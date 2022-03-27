const express = require('express');
const log = require('loglevel');
const mongoTools = require('../db/mongoTools');
const timeseriesRetriever = require('../external-apis/timeseries-retriever');
const WalletAsset = require('../models/walletAsset')
const Tx = require('../models/tx')

const router = new express.Router()

router.get('/wallet', async function (req, res) {
    try {
        res.status(200).json(await WalletAsset.find({}));
    } catch (e) {
        log.error('Erreur GET /wallet' + e)
        res.status(400).send(e)
    }
})

router.get('/tx', async function (req, res) {
    try {
        res.status(200).json(await Tx.find({}).sort({ id: -1 }))
    } catch (e) {
        log.error('Erreur GET /tx' + e)
        res.status(400).send(e)
    }
})

router.put('/wallet', async function (req, res) {
    try {
        const dbAsset = await WalletAsset.findOne({ name: req.body.name })
        if (dbAsset) {
            dbAsset.quantity = req.body.quantity
            const resultat = await dbAsset.save()
            res.status(200).json(resultat);
        } else {
            res.status(400).send()
        }
    } catch (e) {
        log.error('Erreur PUT /wallet')
    }
})

router.put('/wallet/:name/icon', async function (req, res) {
    let resultat = await mongoTools.updateWalletAssetIconByName(req.params.name, req.body.icon);
    res.status(200).json(resultat);
})

router.post('/wallet', async function (req, res) {
    const asset = new WalletAsset(req.body)
    try {
        const assetSaved = await asset.save()
        res.status(200).send(assetSaved)
    } catch (e) {
        log.error("Erreur POST /wallet")
        res.status(400).send()
    }
});

router.get('/watchlist', async function (req, res) {
    let docs = await mongoTools.watchlistFindAll();
    res.status(200).json(docs);
})

router.get('/value', async function (req, res) {
    let docs = await mongoTools.getWalletLastTotalValue();
    res.status(200).json(docs);
})

router.get('/values', async function (req, res) {
    let docs = await mongoTools.walletValuesFindAll();
    res.status(200).json(docs);
})

router.get('/watchlist-summary-chart/:kind', async function (req, res) {
    log.debug("getCurrentSummaries - " + req.query.vsBTC + ' ' + req.query.nbWeek + ' ' + req.params.kind)
    let docs = await timeseriesRetriever.getCurrentSummaries(req.query.vsBTC, req.params.kind);
    res.status(200).json(docs);
})

module.exports = router