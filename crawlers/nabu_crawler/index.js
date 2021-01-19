const Crawler = require("crawler")

const c = new Crawler({
    maxConnections: 10,
    callback: callbackX
})

function callbackX(error, res, done) {
    if (error) {
        console.log(error)
    } else {
        let $ = res.$
        $(".related-content > div > a").each( function() {
            c.queue([{
                uri: $(this).attr("href"),
                jQuery: true,
                callback: callbackY
            }])
        })
    }
    done()
}

function callbackY(error, res, done) {
    if (error) {
        console.log(error)
    } else {
        var $ = res.$
        $("#readspeaker_content :matches(h1, h2, h3, h4, h5, h6, p)").each(function() {
            console.log($(this).text().trim())
        })
    }
    done()
}

module.exports = () => {
    c.queue("https://www.nabu.de/news/18446.html")
}
