<template>
    <main>
        <v-map
            ref="map"
            :zoom="zoom"
            :center="center"
            @update:zoom="zoomUpdate"
            @update:center="centerUpdate"
        >
            <v-icondefault></v-icondefault>
            <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
            <v-marker-cluster :options="clusterOptions" @clusterclick="click()" @ready="ready">
                <v-marker v-for="vendor in vendors" :key="vendor.id" :lat-lng="vendor.latlng" :icon="getIcon(vendor.cat)">
                    <v-popup :content="vendor.details"></v-popup>
                </v-marker>
            </v-marker-cluster>
        </v-map>

    </main>
</template>

<script>
/* Import modules. */
import { Icon, icon, latLng } from 'leaflet'
import { LIconDefault, LMap, LMarker, LPopup, LTileLayer } from 'vue2-leaflet'
import superagent from 'superagent'

import Vue2LeafletMarkercluster from 'vue2-leaflet-markercluster'

// NOTE: Fix for https://vue2-leaflet.netlify.app/quickstart/#marker-icons-are-missing
delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

/* Set default map center. */
// NOTE: Times Square, NYC
const DEFAULT_CENTER = latLng(40.758896, -73.985130)

/* Set default zoom level. */
const DEFAULT_ZOOM = 10

const API_ENDPOINT = `https://api.bitcoincash.site/v1`
// const API_ENDPOINT = `http://localhost:8080/v1`

export default {
    props: {
        latlng: String,
    },
    components: {
        // LMap,
        // LTileLayer,
        // LMarker,
        // LPopup,
        'v-map': LMap,
        'v-tilelayer': LTileLayer,
        'v-icondefault': LIconDefault,
        'v-marker': LMarker,
        'v-popup': LPopup,
        'v-marker-cluster': Vue2LeafletMarkercluster
    },
    data() {
        return {
            map: null,

            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution:
                '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',

            withPopup: DEFAULT_CENTER,
            currentZoom: 11.5,
            currentCenter: DEFAULT_CENTER,

            zoom: 13,
            center: DEFAULT_CENTER,
            bounds: null,
            mapOptions: {
                defaultBaseMap: 'OpenStreetMap',
                center: DEFAULT_CENTER,
                zoom: DEFAULT_ZOOM,
                zoomSnap: 0.5,
                tap: false, // Safari fix (https://github.com/Leaflet/Leaflet/issues/7255)
            },

            // vendors: [],
            // isReady: `<pre>ready and waiting...</pre>`,
            // mapSettings: {
            //     defaultBaseMap: 'OpenStreetMap',
            //     tap: false, // Safari fix (https://github.com/Leaflet/Leaflet/issues/7255)
            //     center: DEFAULT_CENTER,
            //     zoom: DEFAULT_ZOOM,
            // },

            moveTimer: null,
            vendors: null,
            clusterOptions: {},
        }
    },
    watch: {
        latlng: function (_latlng) {
            // console.log('I JUST SAW THE COORDS CHANGE:', _latlng)

            const lat = _latlng.split(',')[0]
            const lng = _latlng.split(',')[1]

            this.map.setView({ lat, lng }, 12)
        },
    },
    methods: {
        getIcon(_category) {
            switch(_category) {
            case 'atm':
                return icon({
                    iconUrl: require('@/assets/atm.png'),
                    iconSize: [32, 32],
                    iconAnchor: [16, 37]
                })
            case 'bch':
                return icon({
                    iconUrl: require('@/assets/bitcoin-cash-bch-logo.png'),
                    iconSize: [32, 32],
                    iconAnchor: [16, 37]
                })
            default:
                return icon({
                    iconUrl: require('@/assets/bitcoin-cash-bch-logo.png'),
                    iconSize: [32, 32],
                    iconAnchor: [16, 37]
                })
            }

        },

        /**
         * Zoom Update
         */
        zoomUpdate(_zoom) {
            // console.log('ZOOM UPDATE', _zoom)
            this.zoom = _zoom

        },

        /**
         * Center Update
         */
        centerUpdate(_center) {
            // console.log('CENTER UPDATE', _center)
            this.center = _center

            /* Clear move timer. */
            clearTimeout(this.moveTimer)

            /* Set move timer. */
            this.moveTimer = setTimeout(() => { this.mapManager() }, 500)

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
                // cat: 'atm',
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
                        // console.log('ATM LOCATIONS (body):', body)

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

                            // console.log('VENDOR SOURCE CAT', vendor._source.category);
                            // if (vendor._source.category === 'atm') {
                            //     this.vendors.push({
                            //         id: vendor._source.id,
                            //         lat: vendor._source.lat,
                            //         lng: vendor._source.lon,
                            //         latlng: [ vendor._source.lat, vendor._source.lon ],
                            //         icon: icon({
                            //             iconUrl: require('@/assets/atm.png'),
                            //             iconSize: [32, 32],
                            //             iconAnchor: [16, 37]
                            //         }),
                            //         text: details,
                            //     })
                            // } else {
                                this.vendors.push({
                                    id: vendor._source.id,
                                    cat: vendor._source.category,
                                    lat: vendor._source.lat,
                                    lng: vendor._source.lon,
                                    latlng: [ vendor._source.lat, vendor._source.lon ],
                                    details,
                                })
                            // }

                        })
                        // this.vendors = body
                    }
                })

        },

        /**
         * Inner Click
         */
        innerClick() {
            alert('Inner Click!')
        },

        click: (e) => console.log("clusterclick", e),
        ready: (e) => console.log('ready', e),

    },
    created: function () {
        /* Initialize vendors. */
        this.vendors = []
    },
    mounted: function () {
        this.$nextTick(() => {
            this.map = this.$refs.map.mapObject

            // this.map.locate({ setView: true, watch: true })
            this.map.locate()
                .on('locationfound', (e) => {
                    // console.log('LOCATION FOUND (e):', e)

                    /* Set latitude. */
                    const lat = e.latitude

                    /* Set longitude. */
                    const lng = e.longitude

                    /* Set map view. */
                    this.map.setView({ lat, lng }, 12)
                })
               .on('locationerror', (e) => {
                    console.log('LOCATION ERROR (e):', e)
                    // alert('Location access denied.')
                })

        })

    },
}
</script>

<style>
.details-title {
    margin-bottom: 0px;
    font-size: 1.4em;
}

.details-category {
    text-align: right;
    font-size: 0.8em;
}
</style>

<style scoped>
@import "~leaflet/dist/leaflet.css";
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";

main {
    width: 100%;
    height: 500px;
}
</style>
