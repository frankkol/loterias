// Imports
const express = require('express')
require('dotenv').config()
const nunjucks = require('nunjucks')
const app = express()
const db = require('./database/db')
const dt = require('../src/utils/dateTime')
const bodyParser = require('body-parser')

nunjucks.configure("src/views", {
    express: app,
    noCache: true,
})

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
    let list = []   
    db.serialize(() => {
        db.get(`SELECT * FROM tbl_megasena WHERE concourse = (SELECT MAX(concourse) FROM tbl_megasena)`, function(err,row) {
            if(err) return console.log(err)
            list.push(row)
        })

        db.get(`SELECT * FROM tbl_quina WHERE concourse = (SELECT MAX(concourse) FROM tbl_quina)`, function(err,row) {
            if(err) return console.log(err)
            list.push(row)
        })

        db.get(`SELECT * FROM tbl_lotofacil WHERE concourse = (SELECT MAX(concourse) FROM tbl_lotofacil)`, function(err,row) {
            if(err) return console.log(err)
            list.push(row)
        })

        db.get(`SELECT * FROM tbl_lotomania WHERE concourse = (SELECT MAX(concourse) FROM tbl_lotomania)`, function(err,row) {
            if(err) return console.log(err)
            list.push(row)
            // return res.send(list)
            return res.render("index.html", { results: list })
        })
    })
})

app.get("/search-results", function(req, res) {
    const search = req.query.search
    const querySelect = `SELECT * FROM tbl_megasena WHERE concourse = ${search}`
    db.all(querySelect, function(err,rows) {
        if(err) {
            return console.log(err)
        }
        return res.send(rows)
    })
})

app.get("/search-all-results", function(req, res) {
    const querySelect = `SELECT * FROM tbl_megasena`
    db.all(querySelect, function(err,rows) {
        if(err) {
            return console.log(err)
        }
        return res.send(rows)
    })
})

app.get("/search-last-results", function(req, res) {
    let list = []   
    db.serialize(() => {
        db.get(`SELECT * FROM tbl_megasena WHERE concourse = (SELECT MAX(concourse) FROM tbl_megasena)`, function(err,row) {
            if(err) return console.log(err)
            list.push(row)
        })

        db.get(`SELECT * FROM tbl_quina WHERE concourse = (SELECT MAX(concourse) FROM tbl_quina)`, function(err,row) {
            if(err) return console.log(err)
            list.push(row)
        })

        db.get(`SELECT * FROM tbl_lotofacil WHERE concourse = (SELECT MAX(concourse) FROM tbl_lotofacil)`, function(err,row) {
            if(err) return console.log(err)
            list.push(row)
        })

        db.get(`SELECT * FROM tbl_lotomania WHERE concourse = (SELECT MAX(concourse) FROM tbl_lotomania)`, function(err,row) {
            if(err) return console.log(err)
            list.push(row)
            return res.send(list)
        })
    })
})

app.post("/save-concourse", function(req, res) {
    const queryInsertMega = `
        INSERT INTO tbl_megasena (concourse, date, onedozen, twodozen, tredozen, fourdozen, fivedozen, sixdozen)
        VALUES (?,?,?,?,?,?,?,?);
    `
    const queryInsertQuina = `
        INSERT INTO tbl_quina (concourse, date, onedozen, twodozen, tredozen, fourdozen, fivedozen)
        VALUES (?,?,?,?,?,?,?);
    `
    const queryInsertLotofacil = `
        INSERT INTO tbl_lotofacil (concourse, date, onedozen, twodozen, tredozen, fourdozen, fivedozen, sixdozen,
                               sevendozen, eightdozen, ninedozen, tendozen, elevendozen, twelvedozen, thirteendozen,
                               fourteendozen, fifteendozen)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
    `
    const queryInsertLotomania = `
        INSERT INTO tbl_lotomania (concourse, date, onedozen, twodozen, tredozen, fourdozen, fivedozen, sixdozen,
                               sevendozen, eightdozen, ninedozen, tendozen, elevendozen, twelvedozen, thirteendozen,
                               fourteendozen, fifteendozen, sixteendozen, seventeendozen, eighteendozen, nineteendozen,
                               twentydozen)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
    `
    
    const conc = req.body.name
    const concourse = req.body.concourse
    const queryConcourse = `SELECT * FROM tbl_${conc} WHERE concourse = ?`
    
    function afterInsertData(err) {
        if(err) {
            return res.send(`${dt.dt()} > Save in database ${err}`)
        }
        return res.send(`${dt.dt()} > Concourse ${concourse}(id: ${this['lastID']}) of ${conc.toUpperCase()} saved success!`)
    }

    db.all(queryConcourse, concourse, function(err,rows) {
        if(err) {
            return res.send(`${dt.dt()} > Select Concourse ${err}`)
        } else {
            if(rows.length === 0){
                if(conc === 'megasena'){
                    const values = [
                        req.body.concourse, req.body.date,
                        req.body.onedozen, req.body.twodozen,
                        req.body.tredozen, req.body.fourdozen,
                        req.body.fivedozen, req.body.sixdozen
                    ]
                    db.run(queryInsertMega, values, afterInsertData)
                }else if (conc === 'quina') {
                    const values = [
                        req.body.concourse, req.body.date,
                        req.body.onedozen, req.body.twodozen,
                        req.body.tredozen, req.body.fourdozen,
                        req.body.fivedozen
                    ]
                    db.run(queryInsertQuina, values, afterInsertData)
                }else if (conc === 'lotofacil') {
                    const values = [
                        req.body.concourse, req.body.date,
                        req.body.onedozen, req.body.twodozen,
                        req.body.tredozen, req.body.fourdozen,
                        req.body.fivedozen, req.body.sixdozen,
                        req.body.sevendozen, req.body.eightdozen,
                        req.body.ninedozen, req.body.tendozen,
                        req.body.elevendozen, req.body.twelvedozen,
                        req.body.thirteendozen, req.body.fourteendozen,
                        req.body.fifteendozen
                    ]
                    db.run(queryInsertLotofacil, values, afterInsertData)
                }else if (conc === 'lotomania') {
                    const values = [
                        req.body.concourse, req.body.date,
                        req.body.onedozen, req.body.twodozen,
                        req.body.tredozen, req.body.fourdozen,
                        req.body.fivedozen, req.body.sixdozen,
                        req.body.sevendozen, req.body.eightdozen,
                        req.body.ninedozen, req.body.tendozen,
                        req.body.elevendozen, req.body.twelvedozen,
                        req.body.thirteendozen, req.body.fourteendozen,
                        req.body.fifteendozen, req.body.sixteendozen,
                        req.body.seventeendozen, req.body.eighteendozen,
                        req.body.nineteendozen, req.body.twentydozen
                    ]
                    db.run(queryInsertLotomania, values, afterInsertData)
                }
            }else {
                return res.send(`${dt.dt()} > Concourse ${concourse}(id: ${rows[0]['id']}) of ${conc.toUpperCase()} already exists!`)
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
const PORT = process.env.SERVER_PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} -> http://localhost:${PORT}`)
})