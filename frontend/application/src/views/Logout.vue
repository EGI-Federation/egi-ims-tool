<template></template>

<script>
// @ is an alias to /src
import router from "@/router";
import { store } from "@/store";
import { mapActions } from "vuex";

export default {
    name: "Logout",
    actions: {
        ...mapActions('oidc', [
            'signOutOidc', // Signs out user in open id provider
            'signOutOidcSilent', // Signs out user in open id provider using a hidden iframe
            'removeOidcUser' // Signs out user in vuex and browser storage, but not in open id provider
        ]),
    },
    mounted() {
        console.log("Logout!");
        store.dispatch("signOut");
        store.dispatch("oidc/signOutOidcSilent");
        router.replace({ path: '/' });
    }
}
</script>
