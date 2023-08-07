<template>
  <div class="about">
    <h1>This is the SLM home page</h1>
  </div>
<ism-footer module-name="SLM" :module-version="slmVersion"/>
</template>

<script>
// @ is an alias to /src
import { isValid } from '@/utils'
import { store } from "@/store"
import IsmFooter from "@/components/footer.vue";
import {languageNames, selectedLocale} from "@/locales";

export default {
    name: 'slmHome',
    components: { IsmFooter },
    data() {
        return {
            slmVersion: "1.0.0",
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
