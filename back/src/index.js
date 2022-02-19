const http = require('http');
const app = require('./app')
const scrappingTools = require('./scrapping-tools');
const socketTools = require('./socket');
const mongoTools = require('./db/mongoTools')
const log = require('loglevel');

const { computePerf,computeWalletValue} = require('./wallet-processor')
require('./cron-tasks/daily-cron')

log.setLevel(process.env.LOG_LEVEL)
const server = http.createServer(app);

async function main(){
    await mongoTools.mongoConnect();
    await computeWalletValue();
    try {
        await scrappingTools.scrapCryptoast();
        await scrappingTools.scrapIDO();
    } catch(e) { 
        log.error("Exception scrappingTools")
    }
    socketTools.initializeSockets(server);
    await computePerf();
}


main();

server.listen(process.env.APP_PORT, () => log.info(`Listening on port ${process.env.APP_PORT}`));