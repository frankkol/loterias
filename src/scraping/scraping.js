// Imports
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const json = require('../concourses.json')
const mongoose = require('mongoose')
const megasenaSchema = require('../schema/megasenaSchema')
const quinaSchema = require('../schema/quinaSchema')
const lotofacilSchema = require('../schema/lotofacilSchema')
const lotomaniaSchema = require('../schema/lotomaniaSchema')

// Variables
const regexConcourseDate = /Concurso\s(\d{4})\s+\((\S+)\)/g
const lot = process.argv[2] || 0

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

// Extract data
async function extractData(conc){
    let name = conc['name']
    let link = conc['link']

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(link)
    let html = await page.content()
    const $ = await cheerio.load(html)
    
    let extractConcourseDate = $('div.content-section.section-text.with-box.no-margin-bottom > div > h2 > span').text()
    let concourseDate = regexConcourseDate.exec(extractConcourseDate);
    let concourse, date = null
    if (concourseDate){
        concourse = concourseDate[1];
        date = concourseDate[2];
    }
    let dozens = []
    if(name == 'lotofacil'){
        for (let lines = 1; lines <= 3; lines++) {
            for (let rows = 1; rows <= 5; rows++) {
                const ten = $(`div.content-section.section-text.with-box.column-left.no-margin-top > div > div > div:nth-child(3) > table > tbody > tr:nth-child(${lines}) > td:nth-child(${rows})`).text()
                dozens.push(ten)
            }
        }
    }else if(name == 'lotomania'){
        for (let lines = 1; lines <= 4; lines++) {
            for (let rows = 1; rows <= 5; rows++) {
                const ten = $(`#conteudoresultado > div.content-section.section-text.with-box.column-left.no-margin-top > div > div > table > tbody > tr:nth-child(${lines}) > td:nth-child(${rows})`).text()
                dozens.push(ten)
            }
        }
    }else if(name == 'megasena' || name == 'quina'){
        for (let rows = 1; rows <= conc['nums']; rows++) {
            const ten = $(`#ulDezenas > li:nth-child(${rows})`).text()
            dozens.push(ten)
        }
    }

    let dados = {name, date, concourse, dozens}
    return dados
    browser.close()
}

// Persist Database
async function persistDatabase(lot){
    const urlDatabase = 'mongodb://localhost'
    const portDatabase = '27017'
    const databases = 'loterias'
    
    const tblmegasena = mongoose.model('tbl_megasena', megasenaSchema)
    const tblquina = mongoose.model('tbl_quina', quinaSchema)
    const tbllotofacil = mongoose.model('tbl_lotofacil', lotofacilSchema)
    const tbllotomania = mongoose.model('tbl_lotomania', lotomaniaSchema)
    
    function isEmpity(obj){
        for(const prop in obj){
            if(obj.hasOwnProperty(prop)){
                return false
            }
        }
        return true
    }

    async function persist(result, objdata){
        if(result){
            result.save(function (error, resultado){
                if(error){
                    console.log(`${dt()} > Error save in database Mongodb ${error}`)
                }else{
                    console.log(`${dt()} > Concourse ${objdata.concourse} of ${objdata.name.toUpperCase()} save success!`)
                    // console.log(`Concourse save success!`)
                }
            })
        }else{
            console.log(`${dt()} > Concourse ${objdata.concourse} of ${objdata.name.toUpperCase()} already exists!`)
            // console.log(`Concourse already exists!`)
        }
        return false
    }
    
    mongoose.connect(`${urlDatabase}:${portDatabase}/${databases}`,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(result => {
        console.log(`${dt()} > Database Mongodb connected on port ${portDatabase} and database ${databases}`)
    }).catch(error => {
        console.log(`${dt()} > Error connect database Mongodb ${error}`)
    })

    const objdata = await extractData(json[lot])
    let select, result = null
    if(objdata.concourse != null){
        if(objdata.name === 'megasena'){
            select = await tblmegasena.find({concourse:objdata.concourse})
            if(isEmpity(select)){
                result = new tblmegasena({
                    concourse: objdata.concourse,
                    date: objdata.date,
                    onedozen: objdata.dozens[0],
                    twodozen: objdata.dozens[1],
                    tredozen: objdata.dozens[2],
                    fourdozen: objdata.dozens[3],
                    fivedozen: objdata.dozens[4],
                    sixdozen: objdata.dozens[5],
                })
            }
        }else if(objdata.name === 'quina'){
            select = await tblquina.find({concourse:objdata.concourse})
            if(isEmpity(select)){
                result = new tblquina({
                    concourse: objdata.concourse,
                    date: objdata.date,
                    onedozen: objdata.dozens[0],
                    twodozen: objdata.dozens[1],
                    tredozen: objdata.dozens[2],
                    fourdozen: objdata.dozens[3],
                    fivedozen: objdata.dozens[4],
                })
            }
        }else if(objdata.name === 'lotofacil'){
            select = await tbllotofacil.find({concourse:objdata.concourse})
            if(isEmpity(select)){
                result = new tbllotofacil({
                    concourse: objdata.concourse,
                    date: objdata.date,
                    onedozen: objdata.dozens[0],
                    twodozen: objdata.dozens[1],
                    tredozen: objdata.dozens[2],
                    fourdozen: objdata.dozens[3],
                    fivedozen: objdata.dozens[4],
                    sixdozen: objdata.dozens[5],
                    sevendozen: objdata.dozens[6],
                    eightdozen: objdata.dozens[7],
                    ninedozen: objdata.dozens[8],
                    tendozen: objdata.dozens[9],
                    elevendozen: objdata.dozens[10],
                    twelvedozen: objdata.dozens[11],
                    thirteendozen: objdata.dozens[12],
                    fourteendozen: objdata.dozens[13],
                    fifteendozen: objdata.dozens[14],
                })
            }
        }else if(objdata.name === 'lotomania'){
            select = await tbllotomania.find({concourse:objdata.concourse})
            if(isEmpity(select)){
                result = new tbllotomania({
                    concourse: objdata.concourse,
                    date: objdata.date,
                    onedozen: objdata.dozens[0],
                    twodozen: objdata.dozens[1],
                    tredozen: objdata.dozens[2],
                    fourdozen: objdata.dozens[3],
                    fivedozen: objdata.dozens[4],
                    sixdozen: objdata.dozens[5],
                    sevendozen: objdata.dozens[6],
                    eightdozen: objdata.dozens[7],
                    ninedozen: objdata.dozens[8],
                    tendozen: objdata.dozens[9],
                    elevendozen: objdata.dozens[10],
                    twelvedozen: objdata.dozens[11],
                    thirteendozen: objdata.dozens[12],
                    fourteendozen: objdata.dozens[13],
                    fifteendozen: objdata.dozens[14],
                    sixteendozen: objdata.dozens[15],
                    seventeendozen: objdata.dozens[16],
                    eighteendozen: objdata.dozens[17],
                    nineteendozen: objdata.dozens[18],
                    twentydozen: objdata.dozens[19],
                })
            }
        }
        await persist(result, objdata)
    }else{
        console.log(`${dt()} > Error scraping data ${json[lot]['name'].toUpperCase()}`)
    }
}

persistDatabase(lot)