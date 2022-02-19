const express = require('express');
const fetch = require('node-fetch');
const cron = require('node-cron');
const bodyParser = require('body-parser');
const http = require("http");
const scrappingTools = require('./scrapping-tools');
const mongoTools = require('./mongoTools');
const socketTools = require('./socket');
const twitter = require('./twitter-interaction');
const timeseriesRetriever = require('./timeseries-retriever');
const walletRouter = require('./routers/wallet-router')
const externalToolsRouter = require('./routers/external-tools-router')

app = express();
const server = http.createServer(app);

async function computeWalletValue(){
    console.log('START - Compute Wallet Value');
    const coinGeckoUrl = process.env.COINGECKO_API_URL
    const docs = await mongoTools.walletFindAll();
    let totalValue = 0;

    for(asset of docs){
        const response = await fetch(`${coinGeckoUrl}?ids=${asset.name}&vs_currencies=usd`);
        const json = await response.json();

        asset.currentPrice = json[asset.name].usd
        asset.currentValue = asset.currentPrice * asset.quantity

        if(asset.lastDailyValue != null){
            asset.dailyBenef = asset.currentValue - asset.lastDailyValue;
        }

        await mongoTools.updateWalletAsset(asset);

        totalValue += asset.currentValue;
    }

    console.log('Valeur totale : ' + totalValue);
    await mongoTools.insertWalletValue(totalValue);
    console.log('END - Compute Wallet Value');

}

async function computePerf(){
    await timeseriesRetriever.computeSummaryForPerf(watchlist, false, 5, 'perf');
    await timeseriesRetriever.computeSummaryForPerf(watchlist, true, 5, 'perf');
}

async function saveWalletDailyValue(){
    console.log('START - Save DAILY wallet value');
    const docs = await mongoTools.walletFindAll();

    for(asset of docs){
        asset.lastDailyValue = asset.currentValue
        await mongoTools.updateWalletAsset(asset);
    }
}

//Middleware 
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();

    app.options('*', (req, res) => {
        // allowed XHR methods  
        res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
        res.send();
    });
});

//Routers
app.use(walletRouter)
app.use(externalToolsRouter)

//Cron
//Toutes les 15mins
cron.schedule('0,15,30,45 * * * *', async function() {
    try {
        await scrappingTools.scrapCryptoast();
        socketTools.emitCryptoastMaj();
        twitter.executeTwitterQuery("cumrocket OR algorand")
        await scrappingTools.scrapIDO()
    } catch(e) {
        console.log("Erreur lors des scrappings")
    }
});

//Toutes les 10min
cron.schedule('0,10,20,30,40,50 * * * *', async function() {
    await computeWalletValue();
    socketTools.emitValuesMaj();
    socketTools.emitWalletMaj();
})

//Tous les jours à 23h50
cron.schedule('50 23 * * *', async function() {
    await saveWalletDailyValue();
    await computePerf();
})

const watchlist = ['sol', 'btc', 'eth','dot','sand','mana','doge','shib','audio','avax','akt','xmr','aave','bat','cfx', 'link','theta', 'chz','grt','enj','vet','rlc','algo', 'matic', 'stx', 'rose', 'egld']

async function main(){
    await mongoTools.mongoConnect();
    await computeWalletValue();
    try {
    await scrappingTools.scrapCryptoast();
    await scrappingTools.scrapIDO();
    } catch(e) { 
        console.log("Erreur lors des scrappings")
    }
    socketTools.initializeSockets(server);
    await computePerf();
}


main();

server.listen(process.env.APP_PORT, () => console.log(`Listening on port ${process.env.APP_PORT}`));