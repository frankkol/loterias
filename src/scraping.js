// Imports
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const json = require('./concourses.json');

// Variables
const regexConcourseDate = /Concurso\s(\d{4})\s+\((\S+)\)/g;

// Extract data
async function extractData(conc){
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(conc['link'])
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
    if(conc['name'] == 'lotofacil'){
        for (let lines = 1; lines <= 3; lines++) {
            for (let rows = 1; rows <= 5; rows++) {
                const ten = $(`div.content-section.section-text.with-box.column-left.no-margin-top > div > div > div:nth-child(3) > table > tbody > tr:nth-child(${lines}) > td:nth-child(${rows})`).text()
                dozens.push(ten)
            }
        }
    }else if(conc['name'] == 'lotomania'){
        for (let lines = 1; lines <= 4; lines++) {
            for (let rows = 1; rows <= 5; rows++) {
                const ten = $(`#conteudoresultado > div.content-section.section-text.with-box.column-left.no-margin-top > div > div > table > tbody > tr:nth-child(${lines}) > td:nth-child(${rows})`).text()
                dozens.push(ten)
            }
        }
    }else if(conc['name'] == 'megasena' || conc['name'] == 'quina'){
        for (let rows = 1; rows <= conc['nums']; rows++) {
            const ten = $(`#ulDezenas > li:nth-child(${rows})`).text()
            dozens.push(ten)
        }
    }

    console.log(`Concurso: ${conc['name'].toUpperCase()}`)
    console.log(`Data: ${date} \nConcurso: ${concourse}`)
    console.log(`Números sorteados: ${dozens}`)
    browser.close()
}
extractData(json[3])