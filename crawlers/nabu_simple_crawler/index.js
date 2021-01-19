const { JSDOM } = require('jsdom')

const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('crawlers/nabu_simple_crawler/db.json')
const db = lowdb(adapter)

db.defaults({ pages: [] }).write()

const simplecrawler = require('simplecrawler')
const crawler = new simplecrawler('https://www.nabu.de/news/18446.html')

crawler.maxDepth = 2

const domainPattern = /\/news\/\d{4}\/\d{2}\//g

crawler.addFetchCondition((queueItem, referrerQueueItem, callback) => {
  callback(null, domainPattern.test(queueItem.url))
})

crawler.on('fetchcomplete', (queueItem, responseBuffer, response) => {
  if(!!db.get('pages').find({ url: queueItem.url }).value()) return

  let page = {
    url: queueItem.url
  }

  if(response.headers['content-type'].includes('text/html')){
    let { document } = (new JSDOM(responseBuffer.toString(), { url: queueItem.url })).window

    page.title = document.title
    page.elements = { }

    console.log(`Crawled ${page.title} (${page.url})`)

    for(let i of Array(6).keys()){
      let heading = document.querySelector(`#readspeaker_content h${i + 1}`)
      if(heading){
        heading = heading.textContent.replace(/\s+/g, ' ').trim()
        if(heading) page.elements[`h${i + 1}`] = heading
      }
    }

    let paragraphs = document.querySelectorAll('#readspeaker_content p')
    if(paragraphs){
      page.elements.paragraphs = Array.from(paragraphs).map(e => e.textContent.replace(/\s+/g, ' ').replace('Mehr →', '').trim()).filter(e => e.length)
    }
  }

  db.get('pages').push(page).write()
})

module.exports = () => {
  crawler.start()
}
