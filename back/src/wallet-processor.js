const mongoTools = require('./db/mongoTools');
const fetch = require('node-fetch');
const timeseriesRetriever = require('./external-apis/timeseries-retriever');


const watchlist = ['sol', 'btc', 'eth','dot','sand','mana','doge','shib','audio','avax','akt','xmr','aave','bat','cfx', 'link','theta', 'chz','grt','enj','vet','rlc','algo', 'matic', 'stx', 'rose', 'egld']

const computeWalletValue = async() => {
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

const computePerf = async () => {
    await timeseriesRetriever.computeSummaryForPerf(watchlist, false, 5, 'perf');
    await timeseriesRetriever.computeSummaryForPerf(watchlist, true, 5, 'perf');
}

const saveWalletDailyValue = async () => {
    console.log('START - Save DAILY wallet value');
    const docs = await mongoTools.walletFindAll();

    for(asset of docs){
        asset.lastDailyValue = asset.currentValue
        await mongoTools.updateWalletAsset(asset);
    }
}

module.exports = {
    computePerf,
    computeWalletValue,
    saveWalletDailyValue
}