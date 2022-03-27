const log = require('loglevel')
const mongoose = require('mongoose')
const Tx = require('./tx')

const walletAssetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    id: {
        type: String,
        required: true,
        upperCase: true
    },
    quantity: {
        type: Number,
        required: true
    },
    previousQuantity: {
        type: Number,
        default: 0
    },
    currentPrice: {
        type: Number
    },
    currentValue: {
        type: Number
    },
    lastDailyValue: {
        type: Number
    },
    dailyBenef: {
        type: Number
    },
    icon: {
        type: String
    }
}, { collection: 'wallet' })


walletAssetSchema.pre('save', async function (next) {
    const previousAsset = await WalletAsset.findOne({name : this.name})
    if(previousAsset){
        this.previousQuantity = (previousAsset.quantity ? previousAsset.quantity : 0)
    }
    next()
});

/**
 * Middleware for adding transaction when saving asset
 */
walletAssetSchema.post('save', async function () {
    const txQuantity = this.previousQuantity ?
        this.quantity - this.previousQuantity : this.quantity

    const tx = new Tx({
        asset: this.name,
        quantity: txQuantity
    })

    try {
        await tx.save()
    } catch (e) {
        log.error("Erreur lors de la creation de la Tx " + e)
    }
})

const WalletAsset = mongoose.model('WalletAsset', walletAssetSchema)

module.exports = WalletAsset