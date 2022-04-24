/* Import modules. */
const moment = require('moment')
const superagent = require('superagent')

/**
 * Administration Module
 */
const admin = async function (req, res) {
    let source

    if (req.params) {
        source = req.params.source
    }

    if (req.method === 'POST') {
        console.log('BODY', req.body)

        return res.json({ hi: 'there!' })
    } else {
        return res.end('done!')

    }

}

/* Export module. */
module.exports = admin
