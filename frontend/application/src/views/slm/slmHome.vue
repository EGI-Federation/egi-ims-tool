<template>
<slm-navbar/>
    <div class="about">
        <br/>
        <h1>This is the SLM home page</h1>
    </div>
<ism-footer module-name="SLM" :module-version="slmVersion"/>
</template>

<script>
// @ is an alias to /src
import { isValid } from '@/utils'
import { store } from "@/store"
import SlmNavbar from "@/components/navbarSLM.vue";
import IsmFooter from "@/components/footer.vue";

export default {
    name: 'slmHome',
    components: { SlmNavbar, IsmFooter },
    data() {
        return {
            slmVersion: "1.0.0",
            loggedIn: store.state.loggedIn,
        }
    },
    methods: {
        processMenu() {
            return false;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
