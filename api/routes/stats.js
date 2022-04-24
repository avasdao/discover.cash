/* Import modules. */
const moment = require('moment')
const PouchDB = require('pouchdb')
const superagent = require('superagent')

/* Initialize cache. */
let cache = {}

/**
 * Statistics
 */
const stats = async function (req, res) {
    // console.log('CONTRACTORS REQ PARAMS', req.params)

    if (req.params && req.params.source) {
        const source = req.params.source
        console.log('STATS SOURCE', source)

        /* Validate database. */
        if (!source) {
            /* Set status. */
            res.status(400)

            /* Return error. */
            return res.json({
                error: `Bad request for an unknown source [ ${source} ]`
            })
        }

        /* Initialize database handler. */
        let db

        /* Initialize limit handler. */
        let limit

        if (req.params.limit) {
            limit = req.params.limit
        }

        /* Handle source. */
        switch(source) {
        case 'cities':
            return require('./stats/cities')(res)
        case 'courses':
            return require('./stats/courses')(res)
        case 'contractors':
            db = new PouchDB(__dirname + '/../data/contractors')
            break
        case 'merchants':
            db = new PouchDB(__dirname + '/../data/merchants')
            break
        case 'people':
            return require('./stats/people')(res)
            // db = new PouchDB(__dirname + '/../data/people')
            // break
        }

        /* Validate database. */
        if (!db) {
            /* Set status. */
            res.status(400)

            /* Return error. */
            return res.json({
                error: `Bad request for an unknown source [ ${source} ]`
            })
        }

        /* Request results. */
        const results = await db.allDocs({ include_docs: true })
            .catch(console.error)
        // console.log('RESULTS', results)

        /* Validate results. */
        if (!results) {
            throw new Error('Could not retrieve PouchDB records.')
        }

        /* Set records. */
        const rs = results.rows
        console.log('# SAVED RECORDS', rs.length)
        // console.log('RECORDS', rs.length, rs)

        /* Build statistics. */
        const stats = {
            limit,
            total: rs.length,
            timestatmp: moment().unix(),
        }

        /* Return statistics. */
        res.json(stats)
    }
}

/* Export module. */
module.exports = stats
