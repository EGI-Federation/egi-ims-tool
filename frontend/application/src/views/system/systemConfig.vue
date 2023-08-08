<template>
    <div class="about">
        <br/>
        <h1>This is the System Config page</h1>
    </div>
</template>

<script>
// @ is an alias to /src
import { isValid } from '@/utils'
import { store } from "@/store"

export default {
    name: 'systemConfig',
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
