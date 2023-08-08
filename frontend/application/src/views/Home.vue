<template>
<ism-navbar v-if="loggedIn"/>
<div class="page">
    <welcome/>
    <div v-if="loggedIn" class="home">
        <div class="greet">{{ $t('home.processes') }}</div>
        <div class="d-flex flex-wrap ism-modules">
            <ism-module
                :title="$t('home.BA')"
                code="BA"
                icon="sliders"
            />
            <ism-module
                :title="$t('home.BDS')"
                code="BDS"
                icon="stack-overflow"
            />
            <ism-module
                :title="$t('home.CAPM')"
                code="CAPM"
                icon="sliders"
            />
            <ism-module
                :title="$t('home.CHM')"
                code="CHM"
                icon="sliders"
            />
            <ism-module
                :title="$t('home.COM')"
                code="COM"
                icon="stack-overflow"
            />
            <ism-module
                :title="$t('home.CONFM')"
                code="CONFM"
                icon="sliders"
            />
            <ism-module
                :title="$t('home.CSI')"
                code="CSI"
                icon="stack-overflow"
            />
            <ism-module
                :title="$t('home.CRM')"
                code="CRM"
                icon="sliders"
            />
            <ism-module
                :title="$t('home.CPM')"
                code="CPM"
                icon="stack-overflow"
            />
            <ism-module
                :title="$t('home.FA')"
                code="FA"
                icon="sliders"
            />
            <ism-module
                :title="$t('home.HR')"
                code="HR"
                icon="stack-overflow"
            />
            <ism-module
                :title="$t('home.ISM')"
                code="ISM"
                icon="sliders"
            />
            <ism-module
                :title="$t('home.ISRM')"
                code="ISRM"
                icon="stack-overflow"
            />
            <ism-module
                :title="$t('home.PPC')"
                code="PPC"
                icon="sliders"
            />
            <ism-module
                :title="$t('home.PM')"
                code="PM"
                icon="stack-overflow"
            />
            <ism-module
                :title="$t('home.PKM')"
                code="PKM"
                icon="sliders"
            />
            <ism-module
                :title="$t('home.PPM')"
                code="PPM"
                icon="stack-overflow"
            />
            <ism-module
                :title="$t('home.RDM')"
                code="RDM"
                icon="sliders"
            />
            <ism-module
                :title="$t('home.RM')"
                code="RM"
                icon="stack-overflow"
            />
            <ism-module
                :title="$t('home.SACM')"
                code="SACM"
                icon="sliders"
            />
            <ism-module
                :title="$t('home.SUPPM')"
                code="SUPPM"
                icon="stack-overflow"
            />
            <ism-module
                :title="$t('home.SLM')"
                code="SLM"
                icon="sliders"
                active=true
            />
            <ism-module
                :title="$t('home.SPM')"
                code="SPM"
                icon="stack-overflow"
            />
            <ism-module
                :title="$t('home.SRM')"
                code="SRM"
                icon="sliders"
            />
        </div>
    </div>
</div>
<ism-footer/>
</template>

<script>
// @ is an alias to /src
import { store } from "@/store"
import IsmNavbar from "@/components/navbar.vue";
import Welcome from "@/components/welcome.vue";
import IsmModule from "@/components/ismModule.vue";
import IsmFooter from "@/components/footer.vue";

export default {
    name: 'Home',
    components: { IsmNavbar, Welcome, IsmModule, IsmFooter },
    data() {
        return {
            loggedIn: store.state.loggedIn,
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.page {
    min-height: 100vh;
}
.home {
    margin: 3rem 5rem 5rem;
    padding: 0;
}
.home .greet {
    text-align: center;
    font-family: "Barlow Condensed", sans-serif;
    border-bottom: 1px solid lightgrey;
    margin: 0 1rem .7rem;
}
.ism-modules {
    gap: .7rem;
    padding: 0;
    justify-content: center;
}

@media screen and (max-width: 770px) {
    .home {
        margin: 3rem 1rem 1rem;
    }
    .ism-modules {
        min-width: 25rem;
    }
}
</style>
