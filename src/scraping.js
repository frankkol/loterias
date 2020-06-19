// Imports
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const json = require('./concourses.json')
const mongoose = require('mongoose')
const megasenaSchema = require('./megasenaSchema')

// Variables
const regexConcourseDate = /Concurso\s(\d{4})\s+\((\S+)\)/g;

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

async function base(){
    const objdados = await extractData(json[0])
    mongoose.connect('mongodb://localhost:27017/loterias',{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(result => {
        console.log('Mongodb Conectado!')
    }).catch(error => {
        console.log('Falha ao conectar no Mongodb' + error)
    })

    const tblmegasena = mongoose.model('tbl_megasena', megasenaSchema)
    const consulta = await tblmegasena.find({concourse:objdados.concourse})

    function estavazio(obj){
        for(const prop in obj){
            if(obj.hasOwnProperty(prop)){
                return false
            }
        }
        return true
    }

    if(estavazio(consulta)){
        const resultado = new tblmegasena({
            concourse: objdados.concourse,
            date: objdados.date,
            onedozen: objdados.dozens[0],
            twodozen: objdados.dozens[1],
            tredozen: objdados.dozens[2],
            fourdozen: objdados.dozens[3],
            fivedozen: objdados.dozens[4],
            sixdozen: objdados.dozens[5],
        })
        resultado.save(function (error, resultado){
            if(error){
                console.log(error)
            }else{
                console.log('Cadastro realizado com sucesso!')
            }
        })
    }else{
        console.log('Este concurso já existe!')
    }
}

base()