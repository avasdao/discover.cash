<template>
    <main class="bg-gray-200 flex justify-between px-2 border-t-2 border-b-2 border-gray-400">
        <div class="text-xs text-gray-500 text-center sm:text-left w-full sm:w-1/2">
            Copyright &copy; {{curYear}}
            <a class="text-blue-500 hover:underline" href="https://panmoni.com" target="_blank">Panmoni</a>.
            All rights reserved.
        </div>

        <div class="hidden sm:block text-xs text-gray-500">
            <a class="text-blue-500 hover:underline" href="https://github.com/Panmoni/discover-cash" target="_blank">
                Source
            </a>
            maintained by
            <a class="text-blue-500 hover:underline" href="https://modenero.com" target="_blank">
                Modenero
            </a>
        </div>
    </main>
</template>

<script>
/* Import modules. */
import moment from 'moment'

export default {
    data: () => {
        return {
            curYear: null,
        }
    },
    created: function () {
        this.curYear = moment().format('YYYY')
    }
}
</script>
