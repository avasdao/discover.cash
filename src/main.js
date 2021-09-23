import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

/* Import tailwind. */
import 'tailwindcss/tailwind.css'

/* Import Leaflet styles. */
import 'leaflet/dist/leaflet.css'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
