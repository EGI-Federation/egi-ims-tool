<template>
    <div class="about">
        <br/>
        <h1>This is the BDS KPIs page</h1>
    </div>
</template>

<script>
// @ is an alias to /src
import { isValid } from '@/utils'
import { store } from "@/store"

export default {
    name: 'bdsKPIs',
    components: {  },
    data() {
        return {
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
