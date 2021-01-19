const { handelsblatt } = require('./handelsblatt')
const { nabu } = require('./nabu')

module.exports = {
    nabu: nabu.main,
    handelsblatt: handelsblatt.main,
}
