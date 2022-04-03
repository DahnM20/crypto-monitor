const socketIo = require("socket.io");
var constants = require("./utils/constants");
const log = require('loglevel');
const Article = require('./models/article');
const WalletAsset = require('./models/walletAsset');
const WalletValue = require("./models/walletValue");


exports.registeredSockets = [];

exports.initializeSockets = (server) => {

    const io = socketIo(server, {
        cors: {
            origin: '*',
        }
    });

    //Socket.io
    io.on("connection", (socket) => {
        this.registerSocket(socket)

        log.debug('Nb sockets : ' + Object.keys(this.getRegisteredSockets()).length)

        this.emitValuesMaj()
        this.emitWalletMaj();
        this.emitCryptoastMaj()

        socket.on("disconnect", () => {
            log.debug("Client disconnected");
            this.deleteSocket(socket)
        });
    });

}

exports.registerSocket = (socket) => {
    this.registeredSockets[socket.id] = socket;
}

exports.deleteSocket = (socket) => {
    this.registeredSockets[socket.id] = null;
    delete this.registeredSockets[socket.id];
}

exports.getRegisteredSockets = () => {
    return this.registeredSockets;
}

exports.getRegisteredSocket = (socketId) => {
    return this.registeredSockets[socketId];
}

exports.emitWalletMaj = async () => {
    wallet = await WalletAsset.find({});

    for (var socketId in this.getRegisteredSockets()) {

        const socket = this.getRegisteredSocket(socketId);
        if (socket != null) {
            socket.emit(constants.EMIT_MAJ_WALLET, wallet);
        }
    }

}

exports.emitCryptoastMaj = async () => {
    for (var socketId in this.getRegisteredSockets()) {

        const socket = this.getRegisteredSocket(socketId);
        if (socket != null) {
            let articles;
            try {
                articles = await Article.find({}).sort({_id : -1}).limit(20)
            } catch (e) {
                log.error('Erreur lors de la recherche des articles ' + e)
            }

            if(articles){
                socket.emit(constants.EMIT_MAJ_NEWS, articles);
            }
        }
    }
}

exports.emitValuesMaj = async () => {
    let docs = await WalletValue.findAllValue()

    for (elem of docs) {
        // Conversion en timestamp
        elem.time = Math.round(new Date(elem.date) / 1000)
        delete elem.id
    }

    for (var socketId in this.getRegisteredSockets()) {

        const socket = this.getRegisteredSocket(socketId)
        if (socket != null) {
            socket.emit(constants.EMIT_MAJ_WALLET_VALUES, docs)
        }
    }
}