// Imports
const express = require('express')
require('dotenv').config()
const app = express()
const db = require('./database/db')
const dt = require('../src/utils/dateTime')
const bodyParser = require('body-parser')

// Parser JSON in Form-data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Server Static files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/assets/css'))
app.use('/js', express.static(__dirname + 'public/assets/js'))
app.use('/img', express.static(__dirname + 'public/assets/img'))

// Dynamic routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

app.get("/search-results", function(req, res) {
    const search = req.query.search
    const querySelect = `SELECT * FROM tbl_mega WHERE concourse = ${search}`
    db.all(querySelect, function(err,rows) {
        if(err) {
            return console.log(err)
        }
        return res.send(rows)
    })
})

app.get("/search-all-results", function(req, res) {
    const querySelect = `SELECT * FROM tbl_mega`
    db.all(querySelect, function(err,rows) {
        if(err) {
            return console.log(err)
        }
        return res.send(rows)
    })
})

app.post("/save-concourse", function(req, res) {
    const queryInsert = `
        INSERT INTO tbl_mega (concourse, date, onedozen, twodozen, tredozen, fourdozen, fivedozen, sixdozen)
        VALUES (?,?,?,?,?,?,?,?);
    `
    
    const queryConcourseMega = "SELECT * FROM tbl_mega WHERE concourse = ?"
    
    const values = [
        req.body.concourse,
        req.body.date,
        req.body.onedozen,
        req.body.twodozen,
        req.body.tredozen,
        req.body.fourdozen,
        req.body.fivedozen,
        req.body.sixdozen
    ]

    function afterInsertData(err) {
        if(err) {
            return res.send(`${dt.dt()} > Save in database ${err}`)
        }
        return res.send(`${dt.dt()} > Concourse ${values[0]}(id: ${this['lastID']}) of MEGA saved success!`)
    }

    db.all(queryConcourseMega, values[0], function(err,rows) {
        if(err) {
            return res.send(`${dt.dt()} > Select Concourse ${err}`)
        } else {
            if(rows.length === 0){
                db.run(queryInsert, values, afterInsertData)
            }else {
                return res.send(`${dt.dt()} > Concourse ${values[0]}(id: ${rows[0]['id']}) of MEGA already exists!`)
            }
        }
    })

})





// Pages backup last concourses
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