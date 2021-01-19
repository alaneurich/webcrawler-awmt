const lowdb = require('lowdb')
const { JSDOM } = require('jsdom')
const Crawler = require("crawler")
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('crawlers/handelsblatt_crawler/db.json')
const db = lowdb(adapter)

db.defaults({ pages: [] }).write()

function parseArticles(error, res, done) {
    if (error) {
        return;
    }

    const { document } = new JSDOM(res.body).window;
    const articles = Array.from(document.querySelectorAll('.c-teaser--Article')).filter(e => 'href' in e.parentElement);
    console.log(`Found ${articles.length} Articles.`)
    articles.forEach(article => {
        const articleLink = article.parentElement.href;
        c.queue({
            uri: `https://www.handelsblatt.com${articleLink}`,
            callback: parseArticle
        });
    });
    done();
}

function parseArticle(error, res, done) {
    if(!!db.get('pages').find({ url: res.request.uri.href.split('?')[0] }).value()) {
        console.log(`Already crawled ${res.request.uri.href}. Skipping.`)
        return;
    }
    const { document } = new JSDOM(res.body).window;

    const author = document.querySelector(`.vhb-author--onecolumn-detail > span`);
    const paragraphs = Array.from(document.querySelector('.vhb-article-area--read').querySelectorAll('p, h1, h2, h3, h4, h5, h6, img')).map(e => {
        return {
            tagName: e.tagName.toLowerCase(),
            content: e.tagName === 'IMG' ? e.src : e.textContent.replace(/\s+/g, ' ').trim()
        }
    }).filter(e => e.content.length);
    const date = document.querySelector('.vhb-publish-info--text').textContent.substr(0, 10).split('.').map(datePart => parseInt(datePart));

    const article = {
        url: res.request.uri.href.split('?')[0],
        year: date[2],
        month: date[1],
        day: date[0],
        overline: document.querySelector('.vhb-overline--onecolumn').textContent.replace(/\s+/g, ' ').trim(),
        title: document.querySelector('.vhb-headline--onecolumn').textContent.replace(/\s+/g, ' ').trim(),
        author: author !== null ? author.textContent.replace(/\s+/g, ' ').trim() : 'No Author',
        content: paragraphs
    };

    console.log(`Crawled ${article.url}.`)

    db.get('pages').push(article).write()
}

const c = new Crawler({
    jQuery: false,
    maxConnections: 100,
    callback: parseArticles
})

module.exports = () => {
    c.queue("https://www.handelsblatt.com/themen/umweltschutz")
}
