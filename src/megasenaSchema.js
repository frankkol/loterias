const mongoose = require('mongoose')

const megasenaSchema = mongoose.Schema({
    concourse: String,
    date: String,
    onedozen: Number,
    twodozen: Number,
    tredozen: Number,
    fourdozen: Number,
    fivedozen: Number,
    sixdozen: Number,
})

module.exports = megasenaSchema