<template>
    <main>
        <div id="map" class="w-full h-96">
            <!-- Mapbox container. -->
        </div>
    </main>
</template>


<script>
import Mapbox from 'mapbox-gl'

// const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibW9kZW5lcm8iLCJhIjoiY2t0eHAxY2JjMDh3MTJ0b3FleGdhYWk4bSJ9.2WOkhBYSiCSd6mW74ocbcQ' // prod
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibW9kZW5lcm8iLCJhIjoiY2tza3hsazR0MGVkazJ2dGVwOXhpaDkzeiJ9.Ogmv-xLwll3Z_1uuCItolg' // localhost

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
                // center: [ -73.9877366, 40.7579747 ],
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

            this.map.addControl(new Mapbox.FullscreenControl())

            this.map.addControl(new Mapbox.NavigationControl({
                showCompass: true,
                showZoom: true,
                visualizePitch: false,
            }))

            this.map.on('load', () => {

                this.addMarkers()

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
