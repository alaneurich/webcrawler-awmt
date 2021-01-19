var Crawler = require("crawler")

module.exports = () => {
    var c = new Crawler({
        maxConnections: 10,

        callback: function (error, res, done) {
            if (error) {
                console.log(error)
            } else {
                var $ = res.$
                $(".related-content > div > a").each( function() {
                    const url = $(this).attr("href")
                    c.queue([{
                        uri: url,
                        jQuery: true,

                        callback: function (error, res, done) {
                            if (error) {
                                console.log(error)
                            } else {
                                var $ = res.$
                                $("#readspeaker_content :matches(h1, h2, h3, h4, h5, h6, p)").each(function() {
                                    console.log($(this).text().trim())
                                })
                            }
                            done();
                        }
                    }])
                })
            }
            done();
        }
    })

    c.queue("https://www.nabu.de/news/18446.html")
}
