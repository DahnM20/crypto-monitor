const express = require('express');
const log = require('loglevel');
const timeseriesRetriever = require('../external-apis/timeseries-retriever');
const WalletAsset = require('../models/walletAsset')
const Tx = require('../models/tx');
const WalletValue = require('../models/walletValue');
const {CoinGeckoPriceRetriever} = require('../external-apis/price-retriever')

const router = new express.Router()
const priceRetriever = new CoinGeckoPriceRetriever();

router.get('/wallet', async function (req, res) {
    try {
        res.status(200).json(await WalletAsset.find({}));
    } catch (e) {
        log.error('Erreur GET /wallet ' + e)
        res.status(400).send(e)
    }
})

router.get('/tx', async function (req, res) {
    try {
        res.status(200).json(await Tx.find({}).sort({ id: -1 }))
    } catch (e) {
        log.error('Erreur GET /tx ' + e)
        res.status(400).send(e)
    }
})

router.put('/wallet', async function (req, res) {
    try {
        const dbAsset = await WalletAsset.findOne({ name: req.body.name })
        if (dbAsset) {
            dbAsset.quantity = req.body.quantity
            const resultat = await dbAsset.save()
            res.status(200).json(resultat)
        } else {
            res.status(400).send()
        }
    } catch (e) {
        log.error('Erreur PUT /wallet ' + e)
    }
})

router.put('/wallet/:name/icon', async function (req, res) {
    try {
        const dbAsset = await WalletAsset.findOne({ name: req.params.name })
        if (dbAsset) {
            dbAsset.icon = req.body.icon
            await dbAsset.save()

            res.status(200).json(resultat)
        } else {
            res.status(400).send()
        }
    } catch (e) {
        log.error('Erreur PUT /wallet/:name/icon ' + e)
    }
})

router.post('/wallet', async function (req, res) {

    const asset = new WalletAsset(req.body)
    try {
        const response = await priceRetriever.getAsset(asset.name)
        if(response){ //L'asset existe dans le price retriever
            asset.currentPrice = response.usd
            const assetSaved = await asset.save()
            res.status(200).send(assetSaved)
        } else {
            res.status(400).send("L'asset n'existe pas")
        }
    } catch (e) {
        log.error("Erreur POST /wallet " + e)
        res.status(400).send()
    }
});

router.get('/value', async function (req, res) {
    try {
        let value = await WalletValue.findLastValue()
        res.status(200).json(value);
    } catch (e) {
        log.error("Erreur GET /value " + e)
        res.status(400).send()
    }
})

router.get('/values', async function (req, res) {
    try {
        let values = await WalletValue.findAllValue()
        res.status(200).json(values);
    } catch (e) {
        log.error("Erreur GET /values " + e)
        res.status(400).send()
    }
})

router.get('/watchlist-summary-chart/:kind', async function (req, res) {
    log.debug("getCurrentSummaries - " + req.query.vsBTC + ' ' + req.query.nbWeek + ' ' + req.params.kind)
    let docs = await timeseriesRetriever.getCurrentSummaries(req.query.vsBTC, req.params.kind);
    res.status(200).json(docs);
})

module.exports = router