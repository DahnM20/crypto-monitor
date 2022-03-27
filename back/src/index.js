const http = require('http');
const app = require('./app')
const socketTools = require('./socket');
const log = require('loglevel');

const { computePerf,computeWalletValue} = require('./wallet-processor')
require('./cron-tasks/daily-cron')
const mongoTools = require('./db/mongoTools')

log.setLevel(process.env.LOG_LEVEL)
const server = http.createServer(app);

async function main(){
    await mongoTools.mongoConnect();
    await computeWalletValue();
    socketTools.initializeSockets(server);
    await computePerf();
}


main();

server.listen(process.env.APP_PORT, () => log.info(`Listening on port ${process.env.APP_PORT}`));