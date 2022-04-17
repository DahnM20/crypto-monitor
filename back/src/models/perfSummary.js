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
            if (value !== 'vsBTC' && value !== 'vsUSD' && value !== 'vol') {
                throw new Error('kind is incorrect')
            }
        }
    }
}, { collection: 'perf-summaries' })

perfSchema.pre('save', async function (next) {
    this.value = this.value.toFixed(2)
    next()
})

perfSchema.statics.getAllSummaryForAsset= async (asset, kind, nbWeek) => {
    let perfs = await PerfSummary.find({
            asset : asset,
            kind : kind
    })

    perfs = perfs.slice(0,nbWeek)

    // Ordre chronologique croissant
    perfs.sort((a,b) => {
        var d1 = new Date(a.week);
        var d2 = new Date(b.week);

        if(d1 > d2) return 1;
        else if(d1 < d2) return -1;
        else return 0
    })

    const summary = {}
    summary.asset = asset

    for(perf of perfs){
        summary[perf.week] = perf.value
    }

    return  summary
}

perfSchema.statics.getGlobalSummary= async (kind, nbWeek) => {
    let assetsNames = await PerfSummary.distinct('asset')

    const globalSummary = []

    for(asset of assetsNames){
        globalSummary.push(await PerfSummary.getAllSummaryForAsset(asset, kind, nbWeek))
    }

    return  globalSummary
}

const PerfSummary = mongoose.model('PerfSummary', perfSchema)

module.exports = PerfSummary