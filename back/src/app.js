const express = require('express');
const bodyParser = require('body-parser');

const walletRouter = require('./routers/wallet-router')
const externalToolsRouter = require('./routers/external-tools-router')

app = express();

//Middleware 
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    app.options('*', (req, res) => {
        // allowed XHR methods  
        res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
        res.send();
    });
    next();
});

//Routers
app.use(walletRouter)
app.use(externalToolsRouter)


module.exports = app