<template>
    <main>
        <Map @onUpdate="handleUpdate" :latlng="lat + ',' + lng" />
        <Info />
        <Search @onChange="handleChange" @onSelect="handleSelect" />
        <Results :vendors="vendors" />
    </main>
</template>

<script>
/* Import components. */
import Info from '@/components/Info.vue'
import Map from '@/components/Map.vue'
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
        }
    },
    methods: {
        /**
         * Change Handler
         */
        handleChange(_userInput) {
            console.log('HANDLE CHANGE (userInput):', _userInput)

            // /* Set query. */
            // const query = _userInput
            //
            // /* Validate query. */
            // if (query.length === 1 || query.length === 2) {
            //     /* Set state. */
            //     setState({
            //         ...state,
            //         vendors: [],
            //         isReady: `<pre>enter at least 3 characters to begin search</pre>`,
            //     })
            // } else if (query.length >= 3) {
            //     /* Request merchants. */
            //     const merchants = await fetch
            //         // (`${API_ENDPOINT}/search/merchants/${query}`)
            //         (`${API_ENDPOINT}/search/${query}`)
            //         .catch(err => console.error)
            //
            //     /* Set vendors. */
            //     const vendors = await merchants
            //         .json()
            //         .catch(err => console.error)
            //     console.log('handleKeyUp.vendors:', vendors)
            //
            //     /* Initialize isReady flag. */
            //     let isReady
            //
            //     /* Validate vendors. */
            //     if (vendors.length === 0) {
            //         isReady = `<pre>No results found. Please try again.</pre>`
            //     } else {
            //         isReady = null
            //     }
            //
            //     /* Set state. */
            //     setState({
            //         ...state,
            //         vendors,
            //         isReady,
            //     })
            // } else {
            //     /* Set state. */
            //     setState({
            //         ...state,
            //         vendors: [],
            //         isReady: `<pre>ready and waiting...</pre>`,
            //     })
            // }

        },

        /**
         * Selection Handler
         */
        handleSelect(_selected) {
            // console.log('HANDLE SELECT (selected):', _selected)

            this.suggestion = _selected.suggestion
            // console.log('HANDLING (suggestion):', this.suggestion)

            this.lat = _selected.vendor.lat
            this.lng = _selected.vendor.lon
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
    },
    mounted: function () {
        //
    },
}
</script>

<style scoped>
/*  */
</style>
