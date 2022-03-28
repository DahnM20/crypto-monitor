const mongoose = require('mongoose')
const {getCurrentDate} = require('../utils/dateUtil')

/**
 * Represents total wallet value at a certain point in time. 
 */
const walletValueSchema = new mongoose.Schema({
    value:{
        type: Number,
        required: true
    },
    date:{
        type: String,
        trim: true
    },
    id:{
        type: Number
    }
}, { collection: 'wallet-value' })

walletValueSchema.statics.findLastValue = async () => {
    const values = await WalletValue.find({}).sort({ id: -1 }).lean()
    return values[0]
}

walletValueSchema.statics.findAllValue = async () => {
    const values = await WalletValue.find({}).sort({ id: -1 }).lean()
    return values.reverse()
}


/**
 * Middleware for adding custom timestamp & id to every value
 */
walletValueSchema.pre('save', async function (next) {
    this.date = getCurrentDate()
    let newId = 1
    try {
        const lastValue = await WalletValue.findLastValue()
        if (lastValue) {
            newId = lastValue.id + 1; // TODO : A ameliorer
        }

        this.id = newId
        next()
    } catch(e) {
        log.error("Erreur pre save for WalletValue " + e)
    }
    
})

const WalletValue = mongoose.model('WalletValue', walletValueSchema)

module.exports = WalletValue