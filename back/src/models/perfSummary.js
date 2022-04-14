const mongoose = require('mongoose')

const perfSchema = new mongoose.Schema({
    asset: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    week: {
        type: String,
        trim: true
    },
    value: {
        type: Number,
        required: true
    },
    kind: {
        type: String,
        trim: true,
        validate(value) {
            if (value !== 'wBTC' && value !== 'wUSD' && value !== 'vol') {
                throw new Error('kind is incorrect')
            }
        }
    },
    id: {
        type: Number
    }
})

perfSchema.statics.getAllSummaryForAsset= async (asset,nbWeek) => {
    let perfs = await PerfSummary.find({
            asset : asset
    }).sort({ id: -1 })

    perfs = perfs.slice(0,nbWeek)

    const summary = {}
    summary.asset = asset

    for(perf of perfs){
        summary[perf.week] = perf.value
    }

    return  summary
}

const PerfSummary = mongoose.model('PerfSummary', perfSchema)

module.exports = PerfSummary