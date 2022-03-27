const log = require('loglevel')
const mongoose = require('mongoose')

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

module.exports = Tx