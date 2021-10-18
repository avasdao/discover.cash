<template>
    <main role="list" class="divide-y divide-gray-200 flex flex-col items-center px-5 pb-5">
        <div
            v-for="vendor of activeVendors"
            :key="vendor.id"
            class="px-4 py-4 bg-gray-200 border-2 border-gray-400 w-full sm:w-3/4 rounded-xl mt-5 sm:mt-10"
        >

            <h3 class="text-2xl font-bold text-center">
                {{vendor.name || vendor.companyName}}
            </h3>

            <div v-if="vendor.type" class="text-right text-sm">
                {{displayType(vendor)}}
            </div>

            <div v-if="vendor.category" class="text-right text-sm">
                {{displayCategory(vendor)}}
            </div>

            <div v-if="vendor.description" class="p-3">
                {{vendor.description}}
            </div>

            <div v-if="vendor.neighborhood" class="text-lg font-bold text-center">
                {{vendor.neighborhood}}
            </div>

            <div v-if="vendor.streetAddress" class="px-3">
                {{vendor.streetAddress}}
            </div>

            <div v-if="vendor.houseno && vendor.street" class="px-3">
                {{vendor.houseno}} {{vendor.street}}
            </div>

            <div v-if="vendor.city && vendor.state && vendor.country" class="px-3">
                {{vendor.city}}, {{vendor.state}}, {{vendor.country}}
            </div>

            <div v-if="vendor.phone" class="px-3">
                Phone: {{vendor.phone}}
            </div>

            <div v-if="vendor.website" class="px-3">
                <a :href="vendor.website" target="_blank">{{vendor.website}}</a>
            </div>

            <div v-if="vendor.googleBusiness" class="flex justify-center text-blue-500 text-lg font-bold p-3">
                <a :href="vendor.googleBusiness" target="_blank">Google Business (link)</a>
            </div>

            <div v-if="vendor.opening_hours" class="p-3">
                {{vendor.opening_hours}}
            </div>

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
        },

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

        displayType(_vendor) {
            if (Array.isArray(_vendor.type)) {
                return _vendor.type[0]
            } else {
                return _vendor.type
            }
        },

        displayCategory(_vendor) {
            if (_vendor.category === 'default') {
                return 'General'
            } else if (_vendor.category === 'atm') {
                return 'ATM'
            } else if (Array.isArray(_vendor.category)) {
                return _vendor.category[0]
            } else {
                return _vendor.category
            }
        },

    },
    created: function () {
        this.numDisplayed = ENTRIES_PER_PAGE
        this.hasMoreEntries = false
        this.resultsRemaining = 0
    },
    mounted: function () {
        //
    },
}
</script>

<style scoped>

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
