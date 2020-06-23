const mongoose = require('mongoose')

const quinaSchema = mongoose.Schema({
    concourse: String,
    date: String,
    onedozen: Number,
    twodozen: Number,
    tredozen: Number,
    fourdozen: Number,
    fivedozen: Number
})

module.exports = quinaSchema