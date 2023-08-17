<template>
    <ism-navbar module-name="ISRM"/>
    <router-view/>
    <ism-footer module-name="ISRM" :module-version="isrmVersion"/>
</template>

<script>
// @ is an alias to /src
import { isValid } from "@/utils";
import { parseRoles } from "@/roles";
import { store } from "@/store";
import IsmNavbar from "@/components/navbar.vue";
import IsmFooter from "@/components/footer.vue";

export default {
    name: 'IncidentServiceRequestManagement',
    components: { IsmNavbar, IsmFooter },
    data() {
        return {
            isrmVersion: "1.0.0",
        }
    },
    created() {
        if(!isValid(store.state.roles))
            parseRoles();
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
