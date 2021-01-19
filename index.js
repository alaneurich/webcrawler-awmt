const { program } = require('commander');
const { crawler } = require('./crawlers')

const AVAILABLE_PARSERS = [
    'nabu',
    'handelsblatt'
]

program.version('0.0.1');

program
    .command('runParser')
    .option('-t, --type <type>', `Parser to start: One of "${AVAILABLE_PARSERS.toString()}"`)
    .action(() => {
        const options = program.opts();

        if (!options.type) {
            console.error('Please supply the type parameter.');
            return;
        }

        if (!AVAILABLE_PARSERS.includes(options.type)) {
            console.error(`Type has to be one of ${AVAILABLE_PARSERS.toString()}. Supplied Type was "${options.type}"`)
            return;
        }

        crawler[options.type]();
    });

program.parse(process.argv);
