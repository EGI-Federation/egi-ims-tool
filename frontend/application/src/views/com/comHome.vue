<template>
    <div class="about">
        <br/>
        <h1>This is the BA home page</h1>
    </div>
</template>

<script>
// @ is an alias to /src
import { isValid } from '@/utils'
import { store } from "@/store"

export default {
    name: 'baHome',
    components: { },
    data() {
        return {
            loggedIn: store.state.loggedIn,
        }
    },
    methods: {
        test() {
            return false;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
