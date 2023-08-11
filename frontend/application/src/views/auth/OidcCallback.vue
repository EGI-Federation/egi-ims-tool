<template>
    <div></div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    name: 'OidcCallback',
    methods: {
        ...mapActions('oidc', [
          'oidcSignInCallback'
        ])
    },
    created () {
        this.oidcSignInCallback()
          .then((redirectPath) => {
              this.$router.push(redirectPath);
          })
          .catch((err) => {
              console.error(err);
              this.$router.push('/oidc-callback-error');
          })
    }
}
</script>
