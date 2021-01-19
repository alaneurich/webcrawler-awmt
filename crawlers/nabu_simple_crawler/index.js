const { JSDOM } = require('jsdom')

const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('crawlers/nabu_simple_crawler/db.json')
const db = lowdb(adapter)

db.defaults({ pages: [] }).write()

const simplecrawler = require('simplecrawler')
const crawler = new simplecrawler('https://www.nabu.de/news/18446.html')

crawler.maxDepth = 2

const domainPattern = /\/news\/(\d{4})\/(\d{2})\//

crawler.addFetchCondition((queueItem, referrerQueueItem, callback) => {
  callback(null, domainPattern.test(queueItem.url))
})

crawler.on('fetchcomplete', (queueItem, responseBuffer, response) => {
  if(!domainPattern.test(queueItem.url)) return
  if(!!db.get('pages').find({ url: queueItem.url }).value()) return

  let [x, year, month] = domainPattern.exec(queueItem.url) || []

  let page = {
    url: queueItem.url,
    year: parseInt(year),
    month: parseInt(month),
  }

  if(response.headers['content-type'].includes('text/html')){
    let { document } = (new JSDOM(responseBuffer.toString(), { url: queueItem.url })).window

    page.title = document.title

    page.content = Array.from(document.querySelector('#readspeaker_content').querySelectorAll('h1, h2, h3, h4, h5, h6, p, img')).map((e) => {
      let content = (e.tagName == 'IMG' ? e.src : e.textContent.replace(/\s+/g, ' '))
      if(e.tagName == 'P') content = content.replace('Mehr →', '')

      return {
        tagName: e.tagName.toLowerCase(),
        content: content.trim(),
      }
    }).filter((e) => e.content.length)
  }

  console.log(`Crawled ${page.title} (${page.url})`)
  db.get('pages').push(page).write()
})

module.exports = () => {
  crawler.start()
}
