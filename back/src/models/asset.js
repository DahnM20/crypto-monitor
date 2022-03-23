const mongoose = require('mongoose')

const assetSchema = new mongoose.Schema({
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
})

const Asset = mongoose.model('Asset', assetSchema)

module.exports = Asset