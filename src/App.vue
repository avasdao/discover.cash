<template>
    <main id="app">
        <router-view />

        <Modals />
        <Notifs />

        <MagicLinkWin
            v-if="showMagicLinkWin"
            @closeMagicLink="closeMagicLink"
        />
    </main>
</template>

<script>
import MagicLinkWin from '@/components/MagicLinkWin'
import Modals from '@/components/Modals'
import Notifs from '@/components/Notifs'

export default {
    components: {
        MagicLinkWin,
        Modals,
        Notifs,
    },
    data: () => ({
        isMenuOpen: null,
        showMagicLinkWin: null,
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

        openMagicLink() {
            this.showMagicLinkWin = true
        },

        closeMagicLink() {
            this.showMagicLinkWin = false
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
