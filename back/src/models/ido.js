const mongoose = require('mongoose')

const idoSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    status:{
        type: String,
        trim: true
    },
    blockchain:{
        type: String,
        trim: true
    },
    website:{
        type: String,
        trim: true
    },
    link:{
        type: String,
        required: true,
        trim: true
    },
    iconLink:{
        type: String,
        trim: true
    }
}, {
    timestamps: true
})

const Ido = mongoose.model('Ido', idoSchema)

module.exports = Ido