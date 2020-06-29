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
    let linkHist = conc['linkHist']
    let nums = conc['nums']
    let scrapedData = []

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(linkHist)
    let html = await page.content()
    const $ = await cheerio.load(html)

    $('body > table > tbody > tr').each((index, element) => {
        if (index === 0) {
            // Ignore first line
            return true
        }else {
            const tds = $(element).find('td')
            if (tds.length <= 2) {
                // Ignore lines nulls
                return true
            }else {
                let dozens = []
                const concourse = $(tds[0]).text().trim().replace('\n', '')
                const date = $(tds[1]).text().trim().replace('\n', '')

                for (let rows = 1; rows <= nums; rows++) {
                    const ten = $(tds[rows + 1]).text().trim().replace('\n', '')
                    dozens.push(ten)
                }
                
                let dados = {name, date, concourse, dozens}
                scrapedData.push(dados)
            }
        }
        // Run first 5 lines
        // if (index === 5) return false
    })
    return scrapedData
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
            console.log(`Concourse ${objdata.concourse} of ${objdata.name.toUpperCase()} already exists!`)
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

    const arrayData = await extractData(json[lot])
    for (const [idx, objdata] of arrayData.entries()) {
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
            console.log(`${dt()} > Error scraping data ${json[conc]['name'].toUpperCase()}`)
        }
    }
}

persistDatabase(lot)