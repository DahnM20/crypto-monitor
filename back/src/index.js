const express = require('express');
const bodyParser = require('body-parser');
const http = require("http");
const scrappingTools = require('./scrapping-tools');
const socketTools = require('./socket');
const mongoTools = require('./db/mongoTools')
const walletRouter = require('./routers/wallet-router')
const externalToolsRouter = require('./routers/external-tools-router')
const { computePerf,computeWalletValue,saveWalletDailyValue} = require('./wallet-processor')
require('./cron-tasks/daily-cron')

app = express();
const server = http.createServer(app);

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