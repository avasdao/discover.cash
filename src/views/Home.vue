<template>
    <main>
        <Map @onUpdate="handleUpdate" :startPos="latlng" :startZoom="zoom" :isEmbedded="isEmbedded" />
        <Info />
        <Search v-if="!isEmbedded" @onChange="handleChange" @onSelect="handleSelect" />
        <Results v-if="!isEmbedded" :vendors="vendors" />
    </main>
</template>

<script>
/* Import components. */
import Info from '@/components/Info.vue'
import Map from '@/components/Mapbox.vue'
import Results from '@/components/Results.vue'
import Search from '@/components/Search.vue'

export default {
    components: {
        Info,
        Map,
        Results,
        Search,
    },
    data: () => {
        return {
            suggestion: null,
            vendors: null,

            lat: null,
            lng: null,
            zoom: null,

            isEmbedded: null,
        }
    },
    computed: {
        latlng() {
            if (!this.lat || !this.lng) {
                return null
            }

            return this.lat + ',' + this.lng
        },
    },
    methods: {
        init() {
            const query = this.$route.query
            // console.log('QUERY', query)

            /* Handle embedded map. */
            if (query && typeof query.embed !== 'undefined') {
                this.isEmbedded = true
            }

            /* Handle latitude / longitude view. */
            if (query && query.latlng) {
                this.lat = query.latlng.split(',')[0]
                this.lng = query.latlng.split(',')[1]
            }

            /* Handle latitude / longitude view. */
            if (query && query.lat && query.lng) {
                this.lat = query.lat
                this.lng = query.lng
            }

            /* Handle latitude / longitude view. */
            if (query && query.lat && query.lon) {
                this.lat = query.lat
                this.lng = query.lon
            }

            /* Handle zoom. */
            if (query && query.zoom) {
                this.zoom = query.zoom
            }

            /* Handle zoom. */
            if (query && query.z) {
                this.zoom = query.z
            }

        },

        /**
         * Change Handler
         */
        handleChange(_userInput) {
            console.log('HANDLE CHANGE (userInput):', _userInput)
        },

        /**
         * Selection Handler
         */
        handleSelect(_selected) {
            // console.log('HANDLE SELECT (selected):', _selected)

            if (_selected) {
                this.suggestion = _selected.suggestion
                // console.log('HANDLING (suggestion):', this.suggestion)

                if (_selected.vendor.lat && _selected.vendor.lon) {
                    this.lat = _selected.vendor.lat
                    this.lng = _selected.vendor.lon
                }

                if (_selected.vendor.lat && _selected.vendor.lng) {
                    this.lat = _selected.vendor.lat
                    this.lng = _selected.vendor.lng
                }
            }
        },

        /**
         * Update Handler
         */
        handleUpdate(_vendors) {
            // console.log('HANDLE UPDATE (vendors):', _vendors)

            /* Initialize vendors. */
            this.vendors = []

            _vendors.forEach(vendor => {
                // console.log('HANDLE VENDOR', vendor)

                this.vendors.push(vendor._source)
            })
        },

    },
    created: function () {
        /* Initialize vendors. */
        this.vendors = []

        this.isEmbedded = false

        this.lat = 10.505399     // Caracas, Venezuela
        this.lng = -66.888721    // Caracas, Venezuela
        // this.lat = 40.7579747       // Times Square, New York
        // this.lng = -73.9877366      // Times Square, New York

        this.init()
    },
    mounted: function () {
        //
    },
}
</script>
