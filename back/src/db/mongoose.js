const mongoose = require('mongoose')
const log = require('loglevel');

const connectMongoose = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL 
            + '/' + process.env.MONGODB_NAME + '?authSource=admin')
        log.info(`Connecté à MongoDB - ${process.env.MONGODB_URL}/${process.env.MONGODB_NAME}?authSource=admin`)
    } catch(e) {
        log.error("Impossible de se connecter à la BD " + e)
        process.exit(1)
    }
}

connectMongoose()