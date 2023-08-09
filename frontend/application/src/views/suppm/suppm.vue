<template>
    <ism-navbar module-name="SUPPM"/>
    <router-view/>
    <ism-footer module-name="SUPPM" :module-version="suppmVersion"/>
</template>

<script>
// @ is an alias to /src
import { store } from "@/store";
import IsmNavbar from "@/components/navbar.vue";
import IsmFooter from "@/components/footer.vue";

export default {
    name: 'SupplierRelationshipManagement',
    components: { IsmNavbar, IsmFooter },
    data() {
        return {
            suppmVersion: "1.0.0",
            loggedIn: store.state.loggedIn,
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
