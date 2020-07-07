// Imports
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const axios = require('axios')
const json = require('../concourses.json')
const dt = require('../utils/dateTime')

// Variables
const regexConcourseDate = /Concurso\s(\d{4})\s+\((\S+)\)/g
const lot = process.argv[2] || 0

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
    const objdata = await extractData(json[lot])
    let select, result = null
    if(objdata.concourse != null){
        if(objdata.name === 'megasena'){
            const values = {
                concourse: objdata.concourse,
                date: objdata.date,
                onedozen: objdata.dozens[0],
                twodozen: objdata.dozens[1],
                tredozen: objdata.dozens[2],
                fourdozen: objdata.dozens[3],
                fivedozen: objdata.dozens[4],
                sixdozen: objdata.dozens[5]
            }

            axios.post('http://localhost:3000/save-concourse', values).then((res) => {
                console.log(res.data)
            })
        }
    }
}

persistDatabase(lot)


//Metodo para listar 1 result
// axios.get('http://localhost:3000/search-results?search=1117').then(function(response){
//     console.log(response.data)
// })

//Metodo para listar todos os results
// axios.get('http://localhost:3000/search-all-results').then(function(response){
//     console.log(response.data)
// })

//Metodo para inserir
// axios.post('http://localhost:3000/save-concourse', conc)
//   .then(function(response){
//     console.log(response.data)
// })