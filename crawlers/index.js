const handelsblatt = require('./handelsblatt')
const nabuCrawler = require('./nabu_crawler')
const nabuSimpleCrawler = require('./nabu_crawler')

module.exports = {
    nabuCrawler: nabuCrawler.main,
    nabuSimpleCrawler: nabuSimpleCrawler.main,
    handelsblatt: handelsblatt.main,
}
