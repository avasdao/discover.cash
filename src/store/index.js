import Vue from 'vue'

// import Vuex, { createStore } from 'vuex'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: null,
        // address: null,
        email: null,
        // test: 'hi there!',
    },
    getters: {
        isAdmin(_state) {
            if (_state.email === 'info@modenero.com') {
                return true
            }

            if (_state.email === 'mark') {
                return true
            }

            return false
        },

    },
    actions: {
        //
    },
    mutations: {
        /* Set network. */
        // setNetwork(_state, _network) {
        //     _state.network = _network
        // },

        setUser(_state, _userData) {
            _state.user = _userData
        },

        setEmail(_state, _email) {
            _state.email = _email
        },

    },
    modules: {
        //
    },
    plugins: [createPersistedState()],
})
