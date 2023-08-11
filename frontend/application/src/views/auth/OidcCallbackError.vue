<template>
<div class="error-page">
    <div>
        <h1>Error in authentication</h1>
        <p>{{ oidcError }}</p>
        <br/>
      <button type="button" class="btn btn-primary" @click="acknowledgeError">Back</button>
    </div>
</div>
<ism-footer/>
</template>

<script>
import { mapGetters } from 'vuex'
import IsmFooter from "@/components/footer.vue";

export default {
    name: 'OidcCallbackError',
    components: { IsmFooter },
    computed: {
        ...mapGetters('oidc', [
            'oidcError'
        ]),
    },
    methods: {
        acknowledgeError() {
            this.$router.push('/');
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.error-page {
    margin: 5rem auto;
}
</style>