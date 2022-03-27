const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');

const walletRouter = require('./routers/wallet-router')
const externalToolsRouter = require('./routers/external-tools-router')
require('./db/mongoose')

app = express();

//Middleware 
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());

//Routers
app.use(walletRouter)
app.use(externalToolsRouter)

module.exports = app