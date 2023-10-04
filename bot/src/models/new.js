const mongoose = require('mongoose');

let day = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
const newsSchema = mongoose.Schema({
    id: {
        type: Number,
        trim: true
    },
    title: {
        type: String,
        trim: true
    },
    content: {
        type: String,
        trim: true
    },
    author: {
        type: String,
        trim: true
    },
    publish_date: {
        type: String, default: day
    },
},{
    collection: 'news'
});


module.exports = mongoose.model('news', newsSchema);