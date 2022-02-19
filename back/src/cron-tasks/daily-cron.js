const cron = require('node-cron');
const scrappingTools = require('../scrapping-tools');
const socketTools = require('../socket');
const { computePerf,computeWalletValue,saveWalletDailyValue} = require('../wallet-processor')
const twitter = require('../external-apis/twitter-interaction');

//Cron
//Toutes les 15mins
cron.schedule('0,15,30,45 * * * *', async function() {
    try {
        await scrappingTools.scrapCryptoast();
        socketTools.emitCryptoastMaj();
        twitter.executeTwitterQuery("algorand or thegraph")
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