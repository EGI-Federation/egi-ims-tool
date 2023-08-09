<template></template>

<script>
// @ is an alias to /src
import { store } from "@/store";
import router from "@/router";

export default {
    name: "Login",
    mounted() {
        router.replace({ name: 'home' });
    }
}
</script>
