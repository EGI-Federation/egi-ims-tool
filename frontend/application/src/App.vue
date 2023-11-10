<template>
    <router-view :key="cacheKey"/>
    <toast-messages :id="'toasts'" ref="toasts"/>
</template>

<script>
import { removeUrlAnchor } from "@/utils";
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
    --max-content-width: 60rem;
    --font-scale: 0.9;
}
#app {
    font-family: Hind, Helvetica, Arial, sans-serif;
    font-size: calc(var(--font-scale) * var(--bs-body-font-size));
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    display: flex;
    flex-direction: column;
    min-height: 100%;
}
#app h2 {
    font-size: calc(1.325 * (var(--font-scale) * var(--bs-body-font-size)) + 0.9vw);
    font-weight: 600;
}
#app h3 {
    font-size: calc(1.25 * (var(--font-scale) * var(--bs-body-font-size)) + 0.6vw);
    font-weight: 600;
}
#app h4 {
    font-size: calc(1.25 * (var(--font-scale) * var(--bs-body-font-size)) + 0.6vw);
    font-weight: 500;
}
#app h5 {
    font-size: calc(1.22 * (var(--font-scale) * var(--bs-body-font-size)));
}
#app .fs-5 {
    font-size: calc(1.22 * (var(--font-scale) * var(--bs-body-font-size)))!important;
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
</style>
