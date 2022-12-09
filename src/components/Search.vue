<template>
    <main class="w-full">
        <input
            class="w-full h-12 border-0 border-b-2 border-blue-600 bg-blue-400 text-white text-lg font-bold"
            type="text"
            @change="onChange"
            @keydown="onKeyDown"
            v-model="userInput"
            placeholder="search for Crypto merchants by name, location or type of business"
        />

        <ul
            v-if="filteredSuggestions && filteredSuggestions.length"
            class="border-r-4 border-b-4 border-gray-500 w-96 overflow-hidden rounded-br-xl"
        >
            <li
                class="p-1 bg-gray-50 cursor-pointer "
                v-for="(suggestion, index) of filteredSuggestions"
                :key="suggestion"
                :class="{ 'bg-indigo-500 hover:bg-indigo-700 text-white font-extrabold': index === activeSuggestion, 'hover:bg-gray-300 hover:font-bold border-gray-500 border-t-2': index !== activeSuggestion }"
                @click="onClick(suggestion)"
            >
                {{suggestion}}
            </li>
        </ul>
        <div v-if="!filteredSuggestions" class="bg-pink-800">
            <em>No suggestions available.</em>
        </div>

    </main>
</template>

<script>
/* Import modules. */
import superagent from 'superagent'

const API_ENDPOINT = `https://api.discover.cash/v1`
// const API_ENDPOINT = `http://localhost:8080/v1`

export default {
    data: () => {
        return {
            activeSuggestion: null,
            filteredSuggestions: null,
            suggestions: null,
            userInput: null,
        }
    },
    methods: {
        async getSuggestions() {
            const response = await superagent
                .get(`${API_ENDPOINT}/search/autocomplete/${this.userInput}`)
                .catch(console.error)

            /* Set vendors. */
            this.suggestions = response.body
            // console.log('suggestions:', this.suggestions)

            if (!this.suggestions.keywords || this.suggestions.keywords.length === 0) {
                /* Update state. */
                this.activeSuggestion = 0
                this.filteredSuggestions = []

                return
            }

            const keywords = JSON.parse(JSON.stringify(this.suggestions.keywords))

            /* Filter suggestions. */
            const filteredSuggestions = keywords.filter(
                suggestion =>
                    suggestion.toLowerCase().indexOf(this.userInput.toLowerCase()) > -1
            )
            // console.log('(FILTERED) suggestions:', filteredSuggestions.length, filteredSuggestions)

            /* Update state. */
            this.activeSuggestion = 0
            this.filteredSuggestions = filteredSuggestions

        },

        /**
         * Handle Change
         */
        onChange() {
            /* Validate user input. */
            if (this.userInput.length < 3) {
                this.$emit('onChange', this.userInput)
            } else {
                /* Request suggestions. */
                this.getSuggestions()
            }
        },

        onClick(_suggestion) {
            const hits = this.suggestions.hits
            // console.log('HITS', hits)

            const vendors = hits.map(entry => {
                return entry._source
            })

            const vendor = vendors.find(vendor => {
                if (vendor.name) {
                    return vendor.name === _suggestion
                } else if (vendor.companyName) {
                    return vendor.companyName === _suggestion
                } else {
                    return null
                }
            })

            /* Emit selection. */
            this.$emit('onSelect', {
                suggestion: _suggestion,
                vendor,
                vendors,
            })

            this.userInput = _suggestion

            setTimeout(() => {
                this.activeSuggestion = 0
                this.filteredSuggestions = []
            }, 100)
        },

        onKeyDown(e) {
            // console.log('ONKEYDOWN', this.activeSuggestion, e);
            if (e.keyCode === 13) { // pressed the enter key
                this.activeSuggestion = 0
                this.userInput = this.filteredSuggestions[this.activeSuggestion]

                /* Emit selection. */
                this.$emit('onSelect', this.filteredSuggestions[this.activeSuggestion])
            } else if (e.keyCode === 38) { // pressed the up arrow
                if (this.activeSuggestion === 0) {
                    return
                }

                /* Update active suggestion. */
                this.activeSuggestion = this.activeSuggestion - 1
            } else if (e.keyCode === 40) { // pressed the down arrow
                if (this.activeSuggestion - 1 === this.filteredSuggestions.length) {
                    return
                }

                /* Update active suggestion. */
                this.activeSuggestion = this.activeSuggestion + 1
            }

            this.getSuggestions()

        },

    },
    created: function () {
        /* Initialize state. */
        this.activeSuggestion = 0
        this.filteredSuggestions = []
        this.userInput = ''

    },
    mounted: function () {
        //
    },
}
</script>

<style scoped>
input::placeholder {
    color: rgba(255, 255, 255, 1.0);
}
input:focus {
    outline: none;
}
</style>
