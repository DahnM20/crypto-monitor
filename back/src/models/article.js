const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    img:{
        type: String,
        trim: true
    },
    link:{
        type: String,
        required: true,
        trim: true
    },
    kind:{
        type: String,
        trim: true
    }
}, {
    timestamps: true
})

const Article = mongoose.model('Article', articleSchema)

module.exports = Article