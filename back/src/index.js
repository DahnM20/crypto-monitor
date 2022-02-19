const http = require('http');
const app = require('./app')
const scrappingTools = require('./scrapping-tools');
const socketTools = require('./socket');
const mongoTools = require('./db/mongoTools')

const { computePerf,computeWalletValue,saveWalletDailyValue} = require('./wallet-processor')
require('./cron-tasks/daily-cron')

const server = http.createServer(app);

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