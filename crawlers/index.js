const handelsblattCrawler = require('./handelsblatt_crawler')
const handelsblattSimpleCrawler = require('./handelsblatt_simple_crawler')
const nabuCrawler = require('./nabu_crawler')
const nabuSimpleCrawler = require('./nabu_simple_crawler')

module.exports = {
    nabuCrawler,
    nabuSimpleCrawler,
    handelsblattCrawler,
    handelsblattSimpleCrawler
}
