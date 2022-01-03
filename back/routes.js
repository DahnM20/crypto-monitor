const scrappingTools = require('./scrapping-tools');
const mongoTools = require('./mongoTools');
const twitter = require('./twitter-interaction');
const timeseriesRetriever = require('./timeseries-retriever');

module.exports = function(app){

    //Routes 
    app.get('/cryptoast', function (req, res) {
        res.send(scrappingTools.getNews());
    });

    app.get('/wallet', async function(req,res){
        let docs = await mongoTools.walletFindAll();
        res.status(200).json(docs);
    })

    app.put('/wallet', async function(req, res){
        let resultat = await mongoTools.updateWalletAssetQuantityByName(req.body.name,req.body.quantity);
        res.status(200).json(resultat);
    })

    app.put('/twitterQuery', function(req,res){
        twitter.changeQuery(req.body.query);
        res.status(200).json({"new_query" : req.body.query});
    })

    app.get('/tweets', async function(req,res){
        let tweets = await twitter.executeTwitterQuery();
        res.status(200).json(tweets);
    })

    app.post('/wallet', async function(req, res) {
        let asset = req.body;
        let sucess = mongoTools.insertAssetInWallet(asset);
        (sucess ? res.status(200) : res.status(400))
    });

    app.get('/watchlist', async function(req,res) {
        let docs = await mongoTools.watchlistFindAll();
        res.status(200).json(docs);
    })

    app.get('/value', async function(req,res){
        let docs = await mongoTools.getWalletLastTotalValue();
        res.status(200).json(docs);
    })

    app.get('/values', async function(req,res){
        let docs = await mongoTools.walletValuesFindAll();
        res.status(200).json(docs);
    })

    app.get('/watchlist-summary-chart/:kind', async function(req,res){
        const watchlist = ['sol', 'btc', 'chz', 'matic']
        console.log( req.query.vsBTC + ' ' + req.query.nbWeek + ' ' + req.params.kind)
        let docs = await timeseriesRetriever.getPerfSummaryForList(watchlist, req.query.vsBTC, req.query.nbWeek, req.params.kind);
        res.status(200).json(docs);
    })
}