const mongoose = require('mongoose')

const lotofacilSchema = mongoose.Schema({
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
})

module.exports = lotofacilSchema