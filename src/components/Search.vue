<template>
    <main>
        <input
            type="text"
            @change="onChange"
            @keydown="onKeyDown"
            v-model="userInput"
            placeholder="search for Bitcoin Cash merchants by name, location or type of business"
        />

        <ul v-if="filteredSuggestions" class="suggestions">
            <li
                v-for="(suggestion, index) of filteredSuggestions"
                :key="suggestion"
                :class="{ 'suggestion-active': index === activeSuggestion }"
                @click="onClick(suggestion)"
            >
                {{suggestion}}
            </li>
        </ul>
        <div v-if="!filteredSuggestions" class="no-suggestions">
            <em>No suggestions available.</em>
        </div>

    </main>
</template>

<script>
/* Import modules. */
import superagent from 'superagent'

const API_ENDPOINT = `https://api.panmoni.com/v1`
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
input {
    border-top-style: hidden;
    border-right-style: hidden;
    border-left-style: hidden;
    border-bottom-style: hidden;

    width: calc(100% - 30px);
    height: 40px;

    padding: 5px 15px;

    font-size: 1.2em;

    background-color: rgba(30, 120, 210, 0.8);
    color: rgba(255, 255, 255, 1.0);
}
input::placeholder {
    color: rgba(255, 255, 255, 1.0);
}
input:focus {
    outline: none;
}

.no-suggestions {
    color: #999;
    padding: 0.5rem;
}

.suggestions {
    border: 1px solid #999;
    border-top-width: 0;
    list-style: none;
    margin-top: 0;
    max-height: 143px;
    overflow-y: auto;
    padding-left: 0;
    width: calc(300px + 1rem);
}

.suggestions li {
    padding: 0.5rem;
}

.suggestion-active,
.suggestions li:hover {
    background-color: #008f68;
    color: #fae042;
    cursor: pointer;
    font-weight: 700;
}

.suggestions li:not(:last-of-type) {
    border-bottom: 1px solid #999;
}
</style>
