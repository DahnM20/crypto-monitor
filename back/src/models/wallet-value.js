const mongoose = require('mongoose')

const walletValueSchema = new mongoose.Schema({
    value:{
        type: Number,
        required: true
    },
    date:{
        type: String,
        required: true,
        trim: true
    },
    id:{
        type: Number,
        required: true
    }
})

const WalletValue = mongoose.model('WalletValue', walletValueSchema)

module.exports = WalletValue