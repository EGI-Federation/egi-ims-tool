<template>
<welcome/>
<div v-if="store.state.loggedIn" class="d-flex flex-wrap ism-modules">
    <ism-module
        :title="$t('BA')"
        code="BA"
        icon="sliders"
    />
    <ism-module
        :title="$t('BDS')"
        code="BDS"
        icon="stack-overflow"
    />
    <ism-module
        :title="$t('CAPM')"
        code="CAPM"
        icon="sliders"
    />
    <ism-module
        :title="$t('CHM')"
        code="CHM"
        icon="sliders"
    />
    <ism-module
        :title="$t('COM')"
        code="COM"
        icon="stack-overflow"
    />
    <ism-module
        :title="$t('CONFM')"
        code="CONFM"
        icon="sliders"
    />
    <ism-module
        title="$t('CSI')"
        code="CSI"
        icon="stack-overflow"
    />
    <ism-module
        :title="$t('CRM')"
        code="CRM"
        icon="sliders"
    />
    <ism-module
        :title="$t('CPM')"
        code="CPM"
        icon="stack-overflow"
    />
    <ism-module
        :title="$t('FA')"
        code="FA"
        icon="sliders"
    />
    <ism-module
        :title="$t('HR')"
        code="HR"
        icon="stack-overflow"
    />
    <ism-module
        :title="$t('ISM')"
        code="ISM"
        icon="sliders"
    />
    <ism-module
        :title="$t('ISRM')"
        code="ISRM"
        icon="stack-overflow"
    />
    <ism-module
        :title="$t('PPC')"
        code="PPC"
        icon="sliders"
    />
    <ism-module
        :title="$t('PM')"
        code="PM"
        icon="stack-overflow"
    />
    <ism-module
        :title="$t('PKM')"
        code="PKM"
        icon="sliders"
    />
    <ism-module
        :title="$t('PPM')"
        code="PPM"
        icon="stack-overflow"
    />
    <ism-module
        :title="$t('RDM')"
        code="RDM"
        icon="sliders"
    />
    <ism-module
        :title="$t('RM')"
        code="RM"
        icon="stack-overflow"
    />
    <ism-module
        :title="$t('SACM')"
        code="SACM"
        icon="sliders"
    />
    <ism-module
        :title="$t('SUPPM')"
        code="SUPPM"
        icon="stack-overflow"
    />
    <ism-module
        :title="$t('SLM')"
        code="SLM"
        icon="sliders"
        active=true
    />
    <ism-module
        :title="$t('SPM')"
        code="SPM"
        icon="stack-overflow"
    />
    <ism-module
        :title="$t('SRM')"
        code="SRM"
        icon="sliders"
    />
</div>
</template>

<script>
// @ is an alias to /src
import { store } from "@/store"
import Welcome from "@/components/welcome.vue";
import IsmModule from "@/components/ismModule.vue";

export default {
    name: 'Home',
    components: { Welcome, IsmModule },
    data() {
        return {
            test: false,
        }
    },
    computed: {
        store() {
            return store
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.ism-modules {
    gap: .7rem;
    margin: 3rem 5rem 5rem;
    padding: 0;
    justify-content: center;
}
</style>
