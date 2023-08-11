<template>
    <div></div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    name: 'OidcCallbackPopup',
    methods: {
        ...mapActions('oidc', [
          'oidcSignInPopupCallback'
        ])
    },
    created () {
        this.oidcSignInPopupCallback()
          .catch((err) => {
              console.error("OIDC popup error", err); // Handle errors any way you want
          })
    }
}
</script>
