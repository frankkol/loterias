// Imports
const express = require('express')
require('dotenv').config()
const app = express()

// Server Static files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/assets/css'))
app.use('/js', express.static(__dirname + 'public/assets/js'))
app.use('/img', express.static(__dirname + 'public/assets/img'))

// Dynamic routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})
app.get('/megasena', (req, res) => {
    res.sendFile(__dirname + '/datasource/d_mega.html')
})
app.get('/quina', (req, res) => {
    res.sendFile(__dirname + '/datasource/d_quina.html')
})
app.get('/lotofacil', (req, res) => {
    res.sendFile(__dirname + '/datasource/d_lotfac.html')
})
app.get('/lotomania', (req, res) => {
    res.sendFile(__dirname + '/datasource/d_lotman.html')
})

// Start the server
const PORT = process.env.SERVER_PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} -> http://localhost:${PORT}`)
})