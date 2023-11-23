<template>
    <router-view :key="cacheKey"/>
    <toast-messages :id="'toasts'" ref="toasts"/>
</template>

<script>
import { formatFileSize, removeUrlAnchor } from "@/utils";
import ToastMessages from "@/components/toast.vue";

export default {
    name: 'App',
    components: { ToastMessages },
    computed: {
        cacheKey() {
            // Include the query params in the route key, but not the anchors
            return removeUrlAnchor(this.$route.fullPath);
        },
    },
    methods: {
        tooBigToUpload(fileInfo) {
            let toast = this.$refs.toasts;
            toast.showError(this.$t('ims.error'),
                this.$t('textbox.imageTooBig', {
                    size: formatFileSize(this.$t, fileInfo.size),
                    max: formatFileSize(this.$t, process.env.VUE_APP_MAX_UPLOAD_SIZE)
                }));
        },
        imageExists(fileName) {
            let toast = this.$refs.toasts;
            toast.showError(this.$t('ims.error'),
                            this.$t('textbox.imageExists', { name: fileName }));
        },
    },
}
</script>

<style>
@import url('../node_modules/bootstrap-icons/font/bootstrap-icons.css');
@import url('https://fonts.googleapis.com/css?family=DM+Sans');
@import url('https://fonts.googleapis.com/css?family=Barlow+Condensed');
@import url('https://fonts.googleapis.com/css?family=Hind:wght@300;400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css?family=Anton');

html {
    height: 100%;
}
body {
    height: 100%;
}
:root {
    --menu-background-color: var(--bs-tertiary-bg);
    --menu-item-color: var(--bs-secondary-bg);
    --primary-text-color: #2c3e50;
    --max-content-width: 55rem;
    --content-height: calc(100vh - var(--navbar-height));
    --font-scale: 0.9;
    --font-size-h2: calc(1.32 * (var(--font-scale) * var(--bs-body-font-size)) + 0.9vw);
    --font-size-h3: calc(1.2 * (var(--font-scale) * var(--bs-body-font-size)) + 0.6vw);
    --font-size-h4: calc(1.125 * (var(--font-scale) * var(--bs-body-font-size)) + 0.6vw);
    --font-size-h5: calc(1.122 * (var(--font-scale) * var(--bs-body-font-size)));
}
#app {
    font-family: Hind, Helvetica, Arial, sans-serif;
    font-size: calc(var(--font-scale) * var(--bs-body-font-size));
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: var(--primary-text-color);
    display: flex;
    flex-direction: column;
    min-height: 100%;
}
#app h2 {
    font-size: var(--font-size-h2);
    font-weight: 600;
}
#app h3 {
    font-size: var(--font-size-h3);
    font-weight: 600;
}
#app h4 {
    font-size: var(--font-size-h4);
    font-weight: 500;
}
#app h5 {
    font-size: var(--font-size-h5);
}
#app .fs-5 {
    font-size: calc(1.125 * (var(--font-scale) * var(--bs-body-font-size)))!important;
}
#app h6,
#app .form-control,
#app button.btn {
    font-size: calc(var(--font-scale) * var(--bs-body-font-size));
}
#app .form-control-fix {
    padding-left: 35px!important;
    padding-right: 30px!important;
}
#app .fade-top-border {
    border: 1px solid;
    border-image: linear-gradient(90deg, rgba(233,236,239,1), rgba(60,74,83,0)) 1;
    border-left: none;
    border-bottom:none;
    border-right:none;
}
.page-container {
    position: absolute;
    top: var(--navbar-height);
    left: 0;
    right: 0;
    bottom: 0;
    height: var(--content-height);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}
.page {
    min-height: var(--content-height);
    flex: none;
}
.tooltip {
    font-size: calc(0.9 * var(--font-scale) * var(--bs-tooltip-font-size))!important;
}
.toast {
    font-size: calc(1 * var(--font-scale) * var(--bs-toast-font-size))!important;
}
.dp__input,
.dp__menu_inner {
    font-size: calc(var(--font-scale) * var(--dp-font-size))!important;
}
.dp__input {
    line-height: calc(1.5 * var(--font-scale) * var(--dp-font-size))!important;
}
.gridjs-td {
    vertical-align: top;
    padding: 8px 10px!important;
}
.gridjs-td > span > :last-child {
    margin-bottom: 0!important;
}
.dropdown-menu {
    padding: 0!important;
}
.dropdown-divider {
    margin: 0!important;
}
/* Firefox */
* {
    scrollbar-width: thin;
    scrollbar-color: #d1dbe3 var(--bs-tertiary-bg);
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
    width: 12px;
}

*::-webkit-scrollbar-track {
    background: var(--bs-tertiary-bg);
}

*::-webkit-scrollbar-thumb {
    background-color: #d1dbe3;
    border-radius: 20px;
    border: 3px solid var(--bs-tertiary-bg);
}
</style>
