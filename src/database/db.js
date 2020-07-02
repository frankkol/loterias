const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database("./src/database/database.db")

// Get Datetime
function dt() {
    var dateNow = new Date()
    var day = ("0"+dateNow.getDate()).slice(-2)
    var month = ("0"+dateNow.getMonth()).slice(-2)
    var year = dateNow.getFullYear()
    var hour = ("0"+dateNow.getHours()).slice(-2)
    var minuts = ("0"+dateNow.getMinutes()).slice(-2)
    var seconds = ("0"+dateNow.getSeconds()).slice(-2)
 
    var dateFormat = `${day}-${month}-${year}T${hour}:${minuts}:${seconds}`
    return dateFormat
}

db.serialize(() => {
    
    // Create tables - tbl_mega, tbl_quina, tbl_lotofacil, tbl_lotomania
    db.run(`
        CREATE TABLE IF NOT EXISTS tbl_mega (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            concourse INTEGER,
            date TEXT,
            onedozen INTEGER,
            twodozen INTEGER,
            tredozen INTEGER,
            fourdozen INTEGER,
            fivedozen INTEGER,
            sixdozen INTEGER
        );

        CREATE TABLE IF NOT EXISTS tbl_quina (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            concourse INTEGER,
            date TEXT,
            onedozen INTEGER,
            twodozen INTEGER,
            tredozen INTEGER,
            fourdozen INTEGER,
            fivedozen INTEGER
        );

        CREATE TABLE IF NOT EXISTS tbl_lotofacil (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            concourse INTEGER,
            date TEXT,
            onedozen INTEGER,
            twodozen INTEGER,
            tredozen INTEGER,
            fourdozen INTEGER,
            fivedozen INTEGER,
            sixdozen INTEGER,
            sevendozen INTEGER,
            eightdozen INTEGER,
            ninedozen INTEGER,
            tendozen INTEGER,
            elevendozen INTEGER,
            twelvedozen INTEGER,
            thirteendozen INTEGER,
            fourteendozen INTEGER,
            fifteendozen INTEGER
        );

        CREATE TABLE IF NOT EXISTS tbl_lotomania (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            concourse INTEGER,
            date TEXT,
            onedozen INTEGER,
            twodozen INTEGER,
            tredozen INTEGER,
            fourdozen INTEGER,
            fivedozen INTEGER,
            sixdozen INTEGER,
            sevendozen INTEGER,
            eightdozen INTEGER,
            ninedozen INTEGER,
            tendozen INTEGER,
            elevendozen INTEGER,
            twelvedozen INTEGER,
            thirteendozen INTEGER,
            fourteendozen INTEGER,
            fifteendozen INTEGER,
            sixteendozen INTEGER,
            seventeendozen INTEGER,
            eighteendozen INTEGER,
            nineteendozen INTEGER,
            twentydozen INTEGER
        );

    `)

    // Query Insert Mega
    const queryInsertMega = `
        INSERT INTO tbl_mega (
            concourse, date, onedozen, twodozen, tredozen, fourdozen, fivedozen, sixdozen
        ) VALUES (?,?,?,?,?,?,?,?);
    `
    
    // Query Concourse Mega
    const queryConcourseMega = "SELECT * FROM tbl_mega WHERE concourse = ?"

    // Values Insert Mega
    const values = [1012,"26/06/2020",01,02,03,04,05,06]

    // Function After Insert Data
    function afterInsertData(err) {
        if(err) {
            return console.log(`${dt()} > Save in database ${err}`)
        }
        console.log(`${dt()} > Concourse ${values[0]}(id: ${this['lastID']}) of MEGA saved success!`)
    }
    
    // Function Insert Not Repeat Concourse
    function insertNotRepeatConcourse(values) {
        db.all(queryConcourseMega, values[0], function(err,rows) {
            if(err) {
                return console.log(`${dt()} > Select Concourse ${err}`)
            } else {
                if(rows.length === 0){
                    db.run(queryInsertMega, values, afterInsertData)
                }else {
                    console.log(`${dt()} > Concourse ${values[0]}(id: ${rows[0]['id']}) of MEGA already exists!`)
                }
            }
        })
    }
    
    insertNotRepeatConcourse(values)
    
})
module.exports = db