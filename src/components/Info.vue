<template>
    <main>
        <div>
            Copyright &copy; 2021 <a href="https://panmoni.com" target="_blank">Panmoni</a>. All rights reserved.
        </div>

        <div>
            <a href="https://github.com/Panmoni/discover-cash" target="_blank">Source</a> maintained by <a href="https://modenero.com" target="_blank">Modenero</a>
        </div>
    </main>
</template>

<script>
export default {
    props: {
        msg: String
    }
}
</script>

<style scoped>
main {
    display: flex;
    justify-content: space-between;

    width: calc(100% - 10px);
    padding: 2px 5px;

    font-size: 0.8em;

    border-top: 1pt solid rgba(120, 120, 120, 0.5);
    border-bottom: 1pt solid rgba(120, 120, 120, 0.5);
    background-color: rgba(210, 210, 255, 0.3);
}
@media only screen and (max-device-width: 480px) {
    main {
        display: block;
    }
}
a {
    text-decoration: none;
    color: rgba(210, 30, 30, 1.0);
}
</style>
