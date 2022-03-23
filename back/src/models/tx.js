const mongoose = require('mongoose')

const txSchema = new mongoose.Schema({
    asset:{
        type: String,
        required: true,
        trim: true
    },
    quantity:{
        type: Number,
        required: true
    },
    operation:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(value !== 'add' || value != 'remove'){
                throw new Error('Operation is incorrect')
            }
        }
    },
    timestamp:{
        type: String,
        required: true,
        trim: true
    },
    id:{
        type: Number,
        required: true
    }
})

const Tx = mongoose.model('Tx', txSchema)

module.exports = Tx