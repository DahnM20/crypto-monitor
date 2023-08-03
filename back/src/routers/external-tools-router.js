const Ido = require('../models/ido')
const Article = require('../models/article')

const express = require('express')
const router = new express.Router()

router.get('/cryptoast', async function (req, res) {
    res.send(await Article.find({}));
});

router.get('/ido', async function (req, res) {
    res.send(await Ido.find({}));
});

module.exports = router