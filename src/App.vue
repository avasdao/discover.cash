<template>
    <main id="app">
        <router-view />

        <Modals />
        <Notifs />

    </main>
</template>

<script>
import Modals from '@/components/Modals'
import Notifs from '@/components/Notifs'

export default {
    components: {
        Modals,
        Notifs,
    },
    data: () => ({
        isMenuOpen: null,
    }),
    methods: {
        openMenu() {
            // console.log('OPEN MENU');
            this.isMenuOpen = true
        },

        closeMenu() {
            // console.log('CLOSE MENU');
            this.isMenuOpen = false
        },
    },
    created: function () {
        this.isMenuOpen = false
    },
}
</script>

<style>
body {
    margin: 0px;
    padding: 0px;
    font-family: Helvetica, sans-serif;
}
</style>
