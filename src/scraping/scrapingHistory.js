// Imports
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const axios = require('axios')
const json = require('../concourses.json')
const dt = require('../utils/dateTime')

// Variables
const lot = process.argv[2] || 0

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

    async function persist(result, objdata){
        if(result){
            axios.post('http://localhost:3000/save-concourse', result).then((res) => {
                console.log(res.data)
            })
        }
        return false
    }

    const arrayData = await extractData(json[lot])
    for (const [idx, objdata] of arrayData.entries()) {
        let select, result = null
        if(objdata.concourse != null){
            if(objdata.name === 'megasena'){
                result = {
                    concourse: objdata.concourse,
                    date: objdata.date,
                    onedozen: objdata.dozens[0],
                    twodozen: objdata.dozens[1],
                    tredozen: objdata.dozens[2],
                    fourdozen: objdata.dozens[3],
                    fivedozen: objdata.dozens[4],
                    sixdozen: objdata.dozens[5]
                }
            }else if(objdata.name === 'quina'){
                result = {
                    concourse: objdata.concourse,
                    date: objdata.date,
                    onedozen: objdata.dozens[0],
                    twodozen: objdata.dozens[1],
                    tredozen: objdata.dozens[2],
                    fourdozen: objdata.dozens[3],
                    fivedozen: objdata.dozens[4],
                }
            }else if(objdata.name === 'lotofacil'){
                result = {
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
                }
            }else if(objdata.name === 'lotomania'){
                result = {
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
                }
            }
            await persist(result, objdata)
        }else{
            console.log(`${dt.dt()} > Error scraping data ${json[conc]['name'].toUpperCase()}`)
        }
    }
}

persistDatabase(lot)