const scrappingTools = require('./scrapping-tools');
const mongoTools = require('./db/mongoTools');
const socketIo = require("socket.io");
var constants = require("./utils/constants");


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

        console.log('Nb sockets : ' + Object.keys(this.getRegisteredSockets()).length)
    
        this.emitValuesMaj()
        this.emitWalletMaj();
        this.emitCryptoastMaj()
    
        socket.on("disconnect", () => {
            console.log("Client disconnected");
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

exports.getRegisteredSockets = () =>{
    return this.registeredSockets;
}

exports.getRegisteredSocket = (socketId) => {
    return this.registeredSockets[socketId];
}

exports.emitWalletMaj = async () => {
    wallet = await mongoTools.walletFindAll();

    for (var socketId in this.getRegisteredSockets()){

        const socket = this.getRegisteredSocket(socketId);
        if(socket != null){
            socket.emit(constants.EMIT_MAJ_WALLET, wallet);
        }
    }

}

exports.emitCryptoastMaj = () => {
    for (var socketId in this.getRegisteredSockets()){

        const socket = this.getRegisteredSocket(socketId);
        if(socket != null){
            socket.emit(constants.EMIT_MAJ_NEWS, scrappingTools.getNews());
        }
    }
}

exports.emitValuesMaj = async () => {
    let docs = await mongoTools.walletValuesFindAll();
    console.log('i :' + JSON.stringify(docs[0]))

    for (elem of docs){
        // Conversion en timestamp
        elem.time = Math.round(new Date(elem.date)/1000);
        delete elem.id
    }

    for (var socketId in this.getRegisteredSockets()){

        const socket = this.getRegisteredSocket(socketId);
        if(socket != null){
            socket.emit(constants.EMIT_MAJ_WALLET_VALUES, docs);
        }
    }
}