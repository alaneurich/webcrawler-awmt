const { program } = require('commander');
const crawler = require('./crawlers');

const AVAILABLE_PARSERS = [
    'nabuCrawler',
    'nabuSimpleCrawler',
    'handelsblatt'
];

program.version('0.0.1');

program
    .command('runParser')
    .arguments('<type>')
    .option('-u, --unsafe', 'Whether to skip Certificate Verification')
    .action((type, options) => {
        if (options.unsafe) {
            process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
        }

        if (!type) {
            console.error('Please supply the type parameter.');
            return;
        }

        if (!AVAILABLE_PARSERS.includes(type)) {
            console.error(`Type has to be one of ${AVAILABLE_PARSERS.toString()}. Supplied Type was "${type}"`);
            return;
        }

        crawler[type]();
    });

program.parse(process.argv);
