module.exports = {
    MusixmatchClient: require('./lib'),
    ...require('./lib/model'),
    ...require('./lib/types'),
    ...require('./lib/util/request')
};