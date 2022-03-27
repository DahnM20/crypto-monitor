const mongoose = require('mongoose')

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
    const values = await WalletValue.find({}).sort({ id: -1 })
    return values[0]
}

walletValueSchema.statics.findAllValue = async () => {
    const values = await WalletValue.find({}).sort({ id: -1 })
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

//TODO : Temporaire, a bouger
const paddingWithOneZero = (element) => {
    return (element < 10 ? '0' + element : element)
}

const getCurrentDate = () => {
    // current timestamp in milliseconds
    let ts = Date.now();

    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    let min = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    month = paddingWithOneZero(month);
    date = paddingWithOneZero(date);
    hour = paddingWithOneZero(hour);
    min = paddingWithOneZero(min);
    seconds = paddingWithOneZero(seconds);

    // prints date & time in YYYY-MM-DD format
    return (year + "-" + month + "-" + date + " " + hour + ':' + min + ':' + seconds);
}

module.exports = WalletValue