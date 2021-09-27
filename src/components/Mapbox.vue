<template>
    <main>
        <div id="map" class="w-full h-96">
            <!-- Mapbox container. -->
        </div>
    </main>
</template>


<script>
import Mapbox from 'mapbox-gl'
import superagent from 'superagent'

// const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibW9kZW5lcm8iLCJhIjoiY2t0eHAxY2JjMDh3MTJ0b3FleGdhYWk4bSJ9.2WOkhBYSiCSd6mW74ocbcQ' // prod
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibW9kZW5lcm8iLCJhIjoiY2tza3hsazR0MGVkazJ2dGVwOXhpaDkzeiJ9.Ogmv-xLwll3Z_1uuCItolg' // localhost

const API_ENDPOINT = `https://api.bitcoincash.site/v1`
// const API_ENDPOINT = `http://localhost:8080/v1`

export default {
    props: {
        startPos: String,
        startZoom: Number,
        isEmbedded: Boolean,
    },
    components: {
        //
    },
    watch: {
        // startPos: function (_latlng) {
        //     console.log('I JUST SAW THE COORDS CHANGE:', _latlng)
        //
        //     const lat = _latlng.split(',')[0]
        //     const lng = _latlng.split(',')[1]
        //
        //     this.map.setView({ lat, lng }, 12)
        // },
    },
    data() {
        return {
            accessToken: MAPBOX_ACCESS_TOKEN,
            map: null,
            vendors: null,

            // LEGACY

            // map: null,
            //
            // zoom: 15,
            // currentZoom: null,
            //
            // center: latLng(LOCATION.lat, LOCATION.lng),
            // currentCenter: latLng(LOCATION.lat, LOCATION.lng),
            //
            // url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            // attribution:
            //     '&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a>',
            //
            // withPopup: latLng(40.7244012, -73.997503),
            // withTooltip: latLng(40.7253863, -73.9897977),
            //
            // mapOptions: {
            //     zoomSnap: 1.0
            // },
            // showMap: true
        };
    },
    methods: {
        init() {
            /* Initialize map object. */
            // this.map = this.$refs.map.mapObject

            const config = {
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                // center: [ 103.811279, 1.345399 ],
                // center: [ 40.7579747, -73.9877366 ],
                center: [ -66.888721, 10.505399 ],
                // center: [ -77.04, 38.907 ],
                zoom: 12,
                // maxBounds: [
                //     [ 40.558896, -74.185130 ],
                //     [ 40.958896, -73.785130 ],
                // ],
                // maxBounds: [
                //     [ 103.6, 1.1704753 ],
                //     [ 104.1, 1.4754753 ],
                // ],
            }

            /* Initialize map object. */
            this.map = new Mapbox.Map(config)

            /* Add full screen control. */
            this.map.addControl(new Mapbox.FullscreenControl())

            /* Add navigation control. */
            this.map.addControl(new Mapbox.NavigationControl({
                showCompass: true,
                showZoom: true,
                visualizePitch: false,
            }))

            /* Handle loaded map. */
            this.map.on('load', () => {

                this.map.addSource('places', {
                    // This GeoJSON contains features that include an "icon"
                    // property. The value of the "icon" property corresponds
                    // to an image in the Mapbox Streets style's sprite.
                    type: 'geojson',
                    data: {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                'type': 'Feature',
                                'properties': {
                                    'description':
                                    `<strong class="text-3xl text-pink-500 font-bold">Make it Mount Pleasant</strong><p><a href="http://www.mtpleasantdc.com/makeitmtpleasant" target="_blank" title="Opens in a new window">Make it Mount Pleasant</a> is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>`,
                                    'icon': 'theatre-15'
                                },
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [-66.888721, 10.505399]
                                }
                            },
                            {
                                'type': 'Feature',
                                'properties': {
                                    'description':
                                    '<strong>Mad Men Season Five Finale Watch Party</strong><p>Head to Lounge 201 (201 Massachusetts Avenue NE) Sunday for a <a href="http://madmens5finale.eventbrite.com/" target="_blank" title="Opens in a new window">Mad Men Season Five Finale Watch Party</a>, complete with 60s costume contest, Mad Men trivia, and retro food and drink. 8:00-11:00 p.m. $10 general admission, $20 admission and two hour open bar.</p>',
                                    'icon': 'theatre-15'
                                },
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [-66.878721, 10.515399]
                                }
                            },
                            {
                                'type': 'Feature',
                                'properties': {
                                    'description':
                                    '<strong>Big Backyard Beach Bash and Wine Fest</strong><p>EatBar (2761 Washington Boulevard Arlington VA) is throwing a <a href="http://tallulaeatbar.ticketleap.com/2012beachblanket/" target="_blank" title="Opens in a new window">Big Backyard Beach Bash and Wine Fest</a> on Saturday, serving up conch fritters, fish tacos and crab sliders, and Red Apron hot dogs. 12:00-3:00 p.m. $25.grill hot dogs.</p>',
                                    'icon': 'bar-15'
                                },
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [-66.898721, 10.495399]
                                }
                            },
                            {
                                'type': 'Feature',
                                'properties': {
                                    'description':
                                    '<strong>Ballston Arts & Crafts Market</strong><p>The <a href="http://ballstonarts-craftsmarket.blogspot.com/" target="_blank" title="Opens in a new window">Ballston Arts & Crafts Market</a> sets up shop next to the Ballston metro this Saturday for the first of five dates this summer. Nearly 35 artists and crafters will be on hand selling their wares. 10:00-4:00 p.m.</p>',
                                    'icon': 'art-gallery-15'
                                },
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [-77.111561, 38.882342]
                                }
                            },
                            {
                                'type': 'Feature',
                                'properties': {
                                    'description':
                                    '<strong>Seersucker Bike Ride and Social</strong><p>Feeling dandy? Get fancy, grab your bike, and take part in this year\'s <a href="http://dandiesandquaintrelles.com/2012/04/the-seersucker-social-is-set-for-june-9th-save-the-date-and-start-planning-your-look/" target="_blank" title="Opens in a new window">Seersucker Social</a> bike ride from Dandies and Quaintrelles. After the ride enjoy a lawn party at Hillwood with jazz, cocktails, paper hat-making, and more. 11:00-7:00 p.m.</p>',
                                    'icon': 'bicycle-15'
                                },
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [-77.052477, 38.943951]
                                }
                            },
                        ]
                    },
                    cluster: true,
                    clusterMaxZoom: 14, // Max zoom to cluster points on
                    clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
                })

                // Add a layer showing the places.
                // this.map.addLayer({
                //     'id': 'places',
                //     // 'type': 'symbol',
                //     'type': 'circle',
                //     'source': 'places',
                //     // 'layout': {
                //     //     'icon-image': '{icon}',
                //     //     'icon-allow-overlap': true
                //     // },
                //     'paint': {
                //     'circle-radius': 12,
                //     'circle-stroke-width': 2,
                //     'circle-color': '#FF6969',
                //     'circle-stroke-color': '#FF3333'
                //     }
                // })

                this.map.addLayer({
                    id: 'clusters',
                    type: 'circle',
                    source: 'places',
                    filter: ['has', 'point_count'],
                    paint: {
                        // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                        // with three steps to implement three types of circles:
                        //   * Blue, 20px circles when point count is less than 100
                        //   * Yellow, 30px circles when point count is between 100 and 750
                        //   * Pink, 40px circles when point count is greater than or equal to 750
                        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            '#51bbd6',
                            100,
                            '#f1f075',
                            750,
                            '#f28cb1'
                        ],
                        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            20,
                            100,
                            30,
                            750,
                            40
                        ]
                    }
                })

                this.map.addLayer({
                    id: 'cluster-count',
                    type: 'symbol',
                    source: 'places',
                    filter: ['has', 'point_count'],
                    layout: {
                        'text-field': '{point_count_abbreviated}',
                        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                        'text-size': 12
                    }
                })

                this.map.addLayer({
                    id: 'unclustered-point',
                    type: 'circle',
                    source: 'places',
                    filter: ['!', ['has', 'point_count']],
                    paint: {
                        'circle-color': '#11b4da',
                        'circle-radius': 12,
                        'circle-stroke-width': 1,
                        'circle-stroke-color': '#fff'
                    }
                })

                // When a click event occurs on a feature in the places layer, open a popup at the
                // location of the feature, with description HTML from its properties.
                // this.map.on('click', 'places', (e) => {
                this.map.on('click', 'unclustered-point', (e) => {
                    // Copy coordinates array.
                    const coordinates = e.features[0].geometry.coordinates.slice()
                    const description = e.features[0].properties.description

                    // Ensure that if the map is zoomed out such that multiple
                    // copies of the feature are visible, the popup appears
                    // over the copy being pointed to.
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
                    }

                    new Mapbox.Popup()
                        .setLngLat(coordinates)
                        .setHTML(description)
                        .addTo(this.map)
                })

                // inspect a cluster on click
                this.map.on('click', 'clusters', (e) => {
                    const features = this.map.queryRenderedFeatures(e.point, {
                        layers: ['clusters']
                    })
                    console.log('FEATURES', features)

                    const clusterId = features[0].properties.cluster_id

                    this.map.getSource('places').getClusterExpansionZoom(
                        clusterId,
                        (err, zoom) => {
                            if (err) return

                            this.map.easeTo({
                                center: features[0].geometry.coordinates,
                                zoom: zoom
                            })
                        }
                    )
                })

                // When a click event occurs on a feature in
                // the unclustered-point layer, open a popup at
                // the location of the feature, with
                // description HTML from its properties.
                // this.map.on('click', 'unclustered-point', (e) => {
                //     const coordinates = e.features[0].geometry.coordinates.slice()
                //     const mag = e.features[0].properties.mag
                //     const tsunami =
                //         e.features[0].properties.tsunami === 1 ? 'yes' : 'no';
                //
                //     // Ensure that if the map is zoomed out such that
                //     // multiple copies of the feature are visible, the
                //     // popup appears over the copy being pointed to.
                //     while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                //         coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
                //     }
                //
                //     new Mapbox.Popup()
                //         .setLngLat(coordinates)
                //         .setHTML(
                //             `magnitude: ${mag}<br>Was there a tsunami?: ${tsunami}`
                //         )
                //         .addTo(this.map)
                // });

                this.map.on('mouseenter', 'clusters', () => {
                    this.map.getCanvas().style.cursor = 'pointer'
                })

                this.map.on('mouseleave', 'clusters', () => {
                    this.map.getCanvas().style.cursor = ''
                })

                // Change the cursor to a pointer when the mouse is over the places layer.
                this.map.on('mouseenter', 'unclustered-point', () => {
                    this.map.getCanvas().style.cursor = 'pointer';
                });

                // Change it back to a pointer when it leaves.
                this.map.on('mouseleave', 'unclustered-point', () => {
                    this.map.getCanvas().style.cursor = '';
                })

                // this.addMarkers()

                // this.map.addLayer({
                //     id: 'terrain-data',
                //     type: 'line',
                //     source: {
                //         type: 'vector',
                //         url: 'mapbox://mapbox.mapbox-terrain-v2'
                //     },
                //     'source-layer': 'contour'
                // })

                // this.map.addLayer({
                //         id: 'rpd_parks',
                //         type: 'fill',
                //         source: {
                //             type: 'vector',
                //             url: 'mapbox://mapbox.3o7ubwm8'
                //         },
                //         'source-layer': 'RPD_Parks',
                //         layout: {
                //             visibility: 'visible'
                //         },
                //         paint: {
                //             'fill-color': 'rgba(61,153,80,0.55)'
                //         }
                //     })

            })
        },

        zoomUpdate(_zoom) {
            this.currentZoom = _zoom
        },

        centerUpdate(_center) {
            this.currentCenter = _center
        },

        innerClick() {

            alert(`Click!`)
        },

        addMarkers() {
            const marker_atm = document.createElement('div')
            marker_atm.id = 'marker-atm'

            // make a marker for each feature and add to the map
            new Mapbox.Marker(marker_atm)
            .setLngLat([ -66.888721, 10.505399 ])
            .addTo(this.map)

            new Mapbox.Marker({
                color: '#CC3939',
                draggable: true,
            })
            .setLngLat([ -66.858721, 10.495399 ])
            .addTo(this.map)

            const html = `
<h1 class="text-2xl font-bold text-red-300">Hello World!</h1>
`

            const popup = new Mapbox.Popup({ offset: 40 })
                .setHTML(html)
                .setMaxWidth('300px')

            new Mapbox.Marker({
                color: '#39CC39',
                draggable: false,
            })
                .setLngLat([ -66.918721, 10.505399 ])
                .setPopup(popup)
                .addTo(this.map)
        },

        async mapManager() {
            // console.log('MAP MANAGER')

            /* Clear move timer. */
            this.moveTimer = null

            const bounds = {
                ne: this.map.getBounds()._northEast,
                sw: this.map.getBounds()._southWest,
            }

            const pkg = {
                cat: 'atm',
                bounds,
            }
            // console.log('PKG', pkg);

            await superagent
                .post(`${API_ENDPOINT}/search/map`)
                .send(pkg)
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) return console.error(err)

                    // console.log('ATM LOCATIONS (res):', res)

                    if (res) {
                        const body = res.body
                        console.log('ATM LOCATIONS (body):', body)

                        /* Send vendors back home. */
                        this.$emit('onUpdate', body)

                        /* Clear vendors. */
                        this.vendors = []

                        body.forEach(vendor => {
                            /* Set venue. */
                            const venue = vendor._source
                            // console.log('VENUE', venue)

                            /* Initialize details. */
                            let details = ''

                            /* Validate venue. */
                            if (venue) {
                                /* Initialize address. */
                                let address = ''

                                /* Initialize map link. */
                                let mapLink

                                if (venue.houseno && venue.street) {
                                    address += `${venue.houseno} ${venue.street}<br>`
                                } else if (venue.streetAddress) {
                                    address += `${venue.streetAddress}<br>`
                                } else if (venue.street) {
                                    address += `${venue.street}<br>`
                                }

                                if (venue.city && venue.state && venue.postcode) {
                                    address += `${venue.city}, ${venue.state} ${venue.postcode}<br>`
                                } else if (venue.city && venue.state && venue.postalCode) {
                                    address += `${venue.city}, ${venue.state} ${venue.postalCode}<br>`
                                }

                                /* Handle iOS devices. */
                                if( (navigator.platform.indexOf('iPhone') != -1)
                                    || (navigator.platform.indexOf('iPod') != -1)
                                    || (navigator.platform.indexOf('iPad') != -1)
                                ) {
                                    // FIXME: We should use Apple Maps.
                                    mapLink = `maps://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=${address}`
                                } else {
                                    // FIXME: Make sure this works with alternative Android maps.
                                    mapLink = `https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=${address}`
                                }

                                details += `<div class="details-title">${vendor._source.name || vendor._source.companyName}</div>`

                                details += `<div class="details-category">${vendor._source.category === 'default' ? 'BUSINESS' : Array.isArray(vendor._source.category) ? vendor._source.category[0].toUpperCase() : vendor._source.category.toUpperCase()}</div>`

                                if (address) {
                                    details += `<a href="${mapLink}" target="_blank">${address}</a><br>`
                                }

                                if (venue.phone) {
                                    details += `<a href="tel:${venue.phone}">${venue.phone}</a><br>`
                                }

                                if (venue.email) {
                                    details += `<a href="mailto:${venue.email}">${venue.email}</a><br>`
                                }

                                if (venue.googleBusiness) {
                                    details += `<a href="${venue.googleBusiness}" target="_blank">Google Business (link)</a>`
                                }

                                /* Update details. */
                                // $('div#vendor-details-' + venueid)
                                //     .html(details)
                            }
                            // console.log('DETAILS', details);

                            this.vendors.push({
                                id: vendor._source.id,
                                cat: vendor._source.category,
                                lat: vendor._source.lat,
                                lng: vendor._source.lon,
                                latlng: [ vendor._source.lat, vendor._source.lon ],
                                details,
                            })

                        })
                        // this.vendors = body
                    }
                })

        },

    },
    created: function () {
        //
        Mapbox.accessToken = this.accessToken
    },
    mounted: function () {
        // NOTE: Wait for map object to become available
        // this.$nextTick(this.init)
        // setTimeout(this.init, 10000)
        this.init()



    },
}
</script>

<style>
#marker-atm {
    background-image: url('../assets/atm.png');
    background-size: cover;
    width: 32px;
    height: 32px;
    cursor: pointer;
}
</style>
