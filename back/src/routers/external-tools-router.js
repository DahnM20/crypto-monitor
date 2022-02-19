const scrappingTools = require('../scrapping-tools');
const mongoTools = require('../mongoTools');
const twitter = require('../twitter-interaction');

const express = require('express')
const router = new express.Router()


//Routes 
router.get('/cryptoast', function (req, res) {
    res.send(scrappingTools.getNews());
});

router.get('/ido', function (req, res) {
    res.send(scrappingTools.getIdo());
});

router.put('/twitterQuery', function (req, res) {
    twitter.changeQuery(req.body.query);
    res.status(200).json({ "new_query": req.body.query });
})

router.get('/tweets', async function (req, res) {
    let tweets = await twitter.executeTwitterQuery();
    res.status(200).json(tweets);
})

router.get('/watchlist', async function (req, res) {
    let docs = await mongoTools.watchlistFindAll();
    res.status(200).json(docs);
})

module.exports = router