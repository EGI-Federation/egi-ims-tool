<template>
    <router-view/>
    <toast-messages :id="'toasts'" ref="toasts"/>
</template>

<script>
import ToastMessages from "@/components/toast.vue";

export default {
    name: 'App',
    components: { ToastMessages },
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
#app {
    font-family: Hind, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    display: flex;
    flex-direction: column;
    min-height: 100%;
}
</style>
