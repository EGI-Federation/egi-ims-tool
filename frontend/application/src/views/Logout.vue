<template></template>

<script>
// @ is an alias to /src
import { store } from "@/store";
import router from "@/router";

export default {
    name: "Logout",
    mounted() {
        console.log("Logout!");
        store.dispatch("signOut");
        router.replace({ path: '/' });
    }
}
</script>
