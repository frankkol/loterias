const mongoose = require('mongoose')

const lotomaniaSchema = mongoose.Schema({
    concourse: String,
    date: String,
    onedozen: Number,
    twodozen: Number,
    tredozen: Number,
    fourdozen: Number,
    fivedozen: Number,
    sixdozen: Number,
    sevendozen: Number,
    eightdozen: Number,
    ninedozen: Number,
    tendozen: Number,
    elevendozen: Number,
    twelvedozen: Number,
    thirteendozen: Number,
    fourteendozen: Number,
    fifteendozen: Number,
    sixteendozen: Number,
    seventeendozen: Number,
    eighteendozen: Number,
    nineteendozen: Number,
    twentydozen: Number,
})

module.exports = lotomaniaSchema