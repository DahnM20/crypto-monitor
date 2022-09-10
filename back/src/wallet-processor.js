const timeseriesRetriever = require('./external-apis/timeseries-retriever');
const log = require('loglevel');
const WalletAsset = require('./models/walletAsset');
const WalletValue = require('./models/walletValue');
const tools = require('./utils/tools')
const {CoinGeckoPriceRetriever} = require('./external-apis/price-retriever')


const watchlist = ['sol', 'btc', 'eth','dot','sand','mana','doge','shib','audio','avax','akt','xmr','aave','bat','cfx', 'link','theta', 
'chz','grt','enj','vet','rlc','algo', 'matic', 'stx', 'rose', 'egld']

const priceRetriever = new CoinGeckoPriceRetriever()

const DELAY_BETWEEN_REQUESTS = 3000

const computeWalletValue = async() => {
    log.info('START - Compute Wallet Value');
    const docs = await WalletAsset.find({});
    let totalValue = 0;

    try {

        for(asset of docs){
            tools.delay(DELAY_BETWEEN_REQUESTS)

            log.debug('Asset en cours : ' + asset.name)
            asset.currentPrice = await priceRetriever.retrieveAssetCurrentPrice(asset.name)
            asset.currentValue = asset.currentPrice * asset.quantity
            
            if(asset.lastDailyValue != null){
                asset.dailyBenef = asset.currentValue - asset.lastDailyValue
            }

            await asset.save()

            totalValue += asset.currentValue;
        } 

        log.info('Valeur totale : ' + totalValue);
        const value = new WalletValue({ value: totalValue });
        await value.save()
        log.info('END - Compute Wallet Value');

    } catch(e) {
        log.error("Erreur lors du calcul de la valeur du wallet " + e)
    }
}

const computePerf = async (nbWeek) => {
    await timeseriesRetriever.computeSummaryForPerf(watchlist, nbWeek);
}

const saveWalletDailyValue = async () => {
    log.info('START - Save DAILY wallet value');
    const docs = await WalletAsset.find({});

    for(asset of docs){
        asset.lastDailyValue = asset.currentValue
        await asset.save()
    }
}

module.exports = {
    computePerf,
    computeWalletValue,
    saveWalletDailyValue
}