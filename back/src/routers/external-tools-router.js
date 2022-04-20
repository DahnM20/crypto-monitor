const Ido = require('../models/ido')
const Article = require('../models/article')
const twitter = require('../external-apis/twitter-interaction');

const express = require('express')
const router = new express.Router()

router.get('/cryptoast', async function (req, res) {
    res.send(await Article.find({}));
});

router.get('/ido', async function (req, res) {
    res.send(await Ido.find({}));
});

router.put('/twitterQuery', function (req, res) {
    twitter.changeQuery(req.body.query);
    res.status(200).json({ "new_query": req.body.query });
})

router.get('/tweets', async function (req, res) {
    let tweets = await twitter.executeTwitterQuery();
    res.status(200).json(tweets);
})

module.exports = router