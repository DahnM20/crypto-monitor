const log = require('loglevel')
const mongoose = require('mongoose')
const {getCurrentDate} = require('../utils/dateUtil')

const txSchema = new mongoose.Schema({
    asset: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true
    },
    operation: {
        type: String,
        trim: true,
        lowercase: true,
        validate(value) {
            if (value !== 'add' || value != 'remove') {
                throw new Error('Operation is incorrect')
            }
        }
    },
    timestamp: {
        type: String,
        trim: true
    },
    id: {
        type: Number
    }
}, { collection: 'wallet-tx' })


txSchema.statics.findLastTx = async () => {
    const txs = await Tx.find({}).sort({ id: -1 })
    return txs[0]
}
/**
 * Middleware for adding custom timestamp to every tx
 */
txSchema.pre('save', async function (next) {
    this.timestamp = getCurrentDate()
    this.operation = this.quantity > 0 ? 'add' : 'remove'
    let newId = 1

    try {
        const lastTx = await Tx.findLastTx()
        if (lastTx) {
            newId = lastTx.id + 1; // TODO : A ameliorer
        }

        this.id = newId
        next()
    } catch(e) {
        log.error("Erreur pre save for Tx " + e)
    }
    
})

const Tx = mongoose.model('Tx', txSchema)

module.exports = Tx