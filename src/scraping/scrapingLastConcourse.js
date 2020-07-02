// Imports
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const json = require('../concourses.json')
const db = require("../database/db")

// Variables
const regexConcourseDate = /Concurso\s(\d{4})\s+\((\S+)\)/g
const lot = process.argv[2] || 0
const datab = new db()

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
    const objdata = await extractData(json[lot])
    let select, result = null
    if(objdata.concourse != null){
        if(objdata.name === 'megasena'){
            const values = [
                objdata.concourse,
                objdata.date,
                objdata.dozens[0],
                objdata.dozens[1],
                objdata.dozens[2],
                objdata.dozens[3],
                objdata.dozens[4],
                objdata.dozens[5]
            ]
            datab.insertNotRepeatConcourse(values)
        }
    }
}

// persistDatabase(lot)