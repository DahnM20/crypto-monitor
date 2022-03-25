const mongoose = require('mongoose')

const walletAssetSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    quantity:{
        type: Number,
        required: true
    },
    currentPrice:{
        type: Number
    },
    currentValue:{
        type: Number
    },
    lastDailyValue:{
        type: Number
    },
    dailyBenef:{
        type: Number
    },
    icon:{
        type: String,
        required: true
    }
}, { collection: 'wallet' })

const WalletAsset = mongoose.model('WalletAsset', walletAssetSchema)

module.exports = WalletAsset