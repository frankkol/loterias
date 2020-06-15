// MEGA-SENA 6
// LOTOFACIL 15
// QUINA 5
// LOTOMANIA 20

// Imports
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

// Variables
const lotofacil = 'http://loterias.caixa.gov.br/wps/portal/loterias/landing/lotofacil/'
const regexConcourseDate = /Concurso\s(\d{4})\s+\((\S+)\)/g;

// Extract data
async function extractData(){
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(lotofacil)
    let html = await page.content()
    const $ = await cheerio.load(html)
    let extractConcourseDate = $('#resultados > div.content-section.section-text.with-box.no-margin-bottom > div > h2 > span').text()
    let concourseDate = regexConcourseDate.exec(extractConcourseDate);
    let concourse = concourseDate[1];
    let date = concourseDate[2];
    let dozens = []
    for (let lines = 1; lines <= 3; lines++) {
        for (let rows = 1; rows <= 5; rows++) {
            const ten = $(`#resultados > div.content-section.section-text.with-box.column-left.no-margin-top > div > div > div:nth-child(3) > table > tbody > tr:nth-child(${lines}) > td:nth-child(${rows})`).text()
            dozens.push(ten);
        }
    }

    console.log(`Data: ${date} \nConcurso: ${concourse}`)
    console.log(`Números sorteados: ${dozens}`)
    browser.close()
}

extractData()