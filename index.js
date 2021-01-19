const { program } = require('commander');
const crawler = require('./crawlers')

const AVAILABLE_PARSERS = [
    'nabuCrawler',
    'nabuSimpleCrawler',
    'handelsblatt'
]

program.version('0.0.1');

program
    .command('runParser')
    .arguments('<type>')
    .action(type => {

        if (!type) {
            console.error('Please supply the type parameter.');
            return;
        }

        if (!AVAILABLE_PARSERS.includes(type)) {
            console.error(`Type has to be one of ${AVAILABLE_PARSERS.toString()}. Supplied Type was "${type}"`)
            return;
        }

        crawler[type]();
    });

program.parse(process.argv);
