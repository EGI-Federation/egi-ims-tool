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
        console.log('oidcCallback : ' + this.$router.currentRoute?.value.fullPath)

        this.oidcSignInCallback()
          .then((redirectPath) => {
              this.$router.replace(redirectPath);
          })
          .catch((err) => {
              console.error(err);
              this.$router.push('/oidc-callback-error');
          })
    }
}
</script>
