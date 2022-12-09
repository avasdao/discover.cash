#!/usr/bin/env node

/* Import modules. */
const moment = require('moment')
const superagent = require('superagent')
const { v4: uuidv4 } = require('uuid')

/* Initialize cache. */
let cache

/**
 * Sleep
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Load (Elasticsearch) Coinmap
 */
const loadCoinmap = async function () {
    console.log('Updating coinmap...')

    let response
    let response2
    let results
    let details

    /* Request coinmap venues. */
    response = await superagent
        .get('https://coinmap.org/api/v1/venues/')
        .set('accept', 'json')
        .catch(err => console.error(err))

    cache = response.body.venues
    // console.log('CACHE', cache)

    let count = 0
    /* Handle merchants. */
    for (let i = 12200; i < cache.length; i++) {
        /* Initialize vendor. */
        let vendor = cache[i]
        // console.log('\nVENDOR-1', vendor)

        /* Request coinmap venue. */
        response2 = await superagent
            .get(`https://coinmap.org/api/v1/venues/${vendor.id}`)
            .set('accept', 'json')
            .catch(err => console.error(err))
        // console.log('\nRESPONSE', response2)

        const venue = response2.body.venue
        // console.log('\nVENUE', venue)

        const pkg = {
            _id: venue.id.toString(),
            ...venue,
        }

        /* Add NEW venue to database. */
        results = await coinmapDb.put(pkg)
            .catch(err => console.error('MERCHANTS ERROR:', err))
        console.log('RESULTS', (cache.length - i), results)

        // await sleep(250)
        await sleep(50)
    }

}

/**
 * Process (Node) Elements
 *
 * Will handle all data returned by the Overpass API.
 */
const processElements = (_elements) => {
    /* Handle elements. */
    _elements.forEach(_element => {
        console.log('\nELEMENT', _element)
    })
}

/**
 * Run Overpass
 *
 * Runs the batch process to download the global OSM data for our query
 * into ALL Bitcoin Cash related merchants (nodes).
 */
const runOverpass = async () => {
    console.log('Loading Overpass data...')

    let body
    let response
    let url

    const south = 26.603262883631
    const west = -84.633178710937
    const north = 29.91685223307
    const east = -80.167236328125

    const OVERPASS_ENDPOINT = 'http://overpass-api.de/api/interpreter'
    const DATA_FORMAT = 'json'
    const TIMEOUT_SECONDS = 25
    const NODE_CURRENCY = `node["currency:BCH"="yes"](${south},${west},${north},${east})`
    const NODE_PAYMENT = `node["payment:bitcoincash"="yes"](${south},${west},${north},${east})`

    /* Build request URL. */
    url = `${OVERPASS_ENDPOINT}?data=[out:${DATA_FORMAT}][timeout:${TIMEOUT_SECONDS}];(${NODE_CURRENCY};<;rel(br););out meta;`
    // url = `${OVERPASS_ENDPOINT}?data=[out:${DATA_FORMAT}][timeout:${TIMEOUT_SECONDS}];(${NODE_CURRENCY};${NODE_PAYMENT};<;rel(br););out meta;`

    /* Request coinmap venues. */
    response = await superagent
        .get(url)
        .set('accept', 'json')
        .catch(err => {
            console.error(err)
        })

    /* Validate response. */
    if (response && response.body) {
        body = response.body
        // console.log('BODY', body)

        /* Validate (node) elements. */
        if (body.elements) {
            processElements(body.elements)
        }
    } else {
        throw new Error('Oops! Something went wrong retreiving Overpass API data.')
    }

}

/* Load Overpass data from API. */
runOverpass()
