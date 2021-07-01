<template>
    <main>
        <div class="vendor-results" v-for="vendor of activeVendors" :key="vendor.id">

            <h3>{{vendor.name}}</h3>

            <div v-if="vendor.description" class="vendor-results-description">{{vendor.description}}</div>

            <h3 v-if="vendor.companyName">{{vendor.companyName}}</h3>

            <div v-if="vendor.type">Type: {{vendor.type}}</div>

            <div v-if="vendor.category">
                Category: {{vendor.category === 'default' ? 'general' : vendor.category}}
            </div>

            <div v-if="vendor.streetAddress">Address: {{vendor.streetAddress}}</div>

            <div v-if="vendor.houseno && vendor.street">Address: {{vendor.houseno}} {{vendor.street}}</div>

            <div v-if="vendor.neighborhood">Neighborhood: {{vendor.neighborhood}}</div>

            <div v-if="vendor.city && vendor.state && vendor.country">
                {{vendor.city}}, {{vendor.state}}, {{vendor.country}}
            </div>

            <div v-if="vendor.phone">Phone: {{vendor.phone}}</div>

            <div v-if="vendor.website">
                <a :href="vendor.website" target="_blank">{{vendor.website}}</a>
            </div>

            <div v-if="vendor.googleBusiness">
                <a :href="vendor.googleBusiness" target="_blank">Google Business (link)</a>
            </div>

            <div v-if="vendor.opening_hours">{{vendor.opening_hours}}</div>

        </div>

        <div v-if="hasMoreEntries" class="show-more">
            <div class="btn-show-more" @click="showMoreEntries">
                Show More
                <small class="remaining">{{resultsRemaining}} results remaining</small>
            </div>
        </div>

    </main>
</template>

<script>
/* Initialize constants. */
const ENTRIES_PER_PAGE = 20

export default {
    props: {
        vendors: Array,
    },
    data: () => {
        return {
            numDisplayed: null,
            hasMoreEntries: null,
            resultsRemaining: null,
        }
    },
    watch: {
        vendors: function (_vendors) {
            // console.log('I JUST SAW NEW VENDORS:', _vendors.length, _vendors)

            if (_vendors.length) {
                this.numDisplayed = ENTRIES_PER_PAGE

                if (_vendors.length > this.numDisplayed) {
                    this.hasMoreEntries = true
                } else {
                    this.hasMoreEntries = false
                }

                /* Update remaining. */
                this.resultsRemaining = _vendors.length - this.numDisplayed
            }
        },
    },
    computed: {
        activeVendors() {
            if (!this.vendors) {
                return []
            }

            const active = []

            for (let i = 0; i < this.numDisplayed; i++) {
                if (!this.vendors[i]) continue

                active.push(this.vendors[i])
            }

            // TODO: Pagination does not work with this type of sorting.
            // active.sort(function (a, b) {
            //     if (a.name.toUpperCase() < b.name.toUpperCase()) {
            //         return -1
            //     }
            //     if (a.name.toUpperCase() > b.name.toUpperCase()) {
            //         return 1
            //     }
            //     return 0
            // })

            return active
        }
    },
    methods: {
        showMoreEntries() {
            // console.log('SHOW MORE ENTRIES');

            this.numDisplayed += ENTRIES_PER_PAGE

            if (this.numDisplayed > this.vendors.length) {
                this.numDisplayed = this.vendors.length
            }

            if (this.numDisplayed === this.vendors.length) {
                this.hasMoreEntries = false
            }

            /* Update remaining. */
            this.resultsRemaining = this.vendors.length - this.numDisplayed
        },

    },
    created: function () {
        this.numDisplayed = ENTRIES_PER_PAGE
        this.hasMoreEntries = false
        this.resultsRemaining = 0
    },
    mounted: function () {

    },
}
</script>

<style scoped>
main {
    /* border: 1pt solid blue; */
    width: 100%;
    /* height: 60px; */
}

.vendor-results {
    border-bottom: 2pt solid #aaa;
    padding: 15px;

    text-align: center;
}
.vendor-results-description {
    padding-left: 75px;
    padding-right: 75px;
}

.show-more {
    display: flex;
    margin: 20px 0;
    padding: 15px;
    justify-content: center;
}
.btn-show-more {
    width: 300px;
    padding: 10px;

    border: 1pt solid rgba(90, 90, 180, 0.8);
    border-radius: 20px;

    font-size: 1.7em;
    text-align: center;
    color: white;
    cursor: pointer;

    background-color: rgba(30, 30, 180, 1.0);
}

.remaining {
    display: block;
    font-size: 0.5em;
}
</style>
