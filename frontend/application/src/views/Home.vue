<template>
<ism-navbar v-if="loggedIn"/>
<div class="page">
  <welcome/>
    <div v-if="loggedIn" class="home">
        <div class="greet">{{ $t('navbar.processes') }}</div>
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
    <div v-else class="d-flex flex-nowrap auth">
        <p class="mb-0">{{ $t('home.needAuth') }}</p>
        <p class="mb-2">{{ $t('home.clickAuth') }}</p>
        <div class="checkin-blue-border" @click="authenticateOidc"><p>Sign in with EGI Check-in</p></div>
        <p class="mt-2">
            <b>{{ $t('home.pleaseNote') }}</b>: {{ $t('home.voMember') }}
            {{ $t('home.requestEnroll') }} <a :href="enrollUrl" target="_blank">{{ $t('home.clickingHere') }}</a>.
        </p>
    </div>
</div>
<ism-footer/>
</template>

<script>
// @ is an alias to /src
import { isValid } from "@/utils";
import {parseRoles, rolesFromEntitlements} from "@/roles";
import { store } from "@/store"
import { mapActions } from "vuex";
import IsmNavbar from "@/components/navbar.vue";
import Welcome from "@/components/welcome.vue";
import IsmModule from "@/components/imsModule.vue";
import IsmFooter from "@/components/footer.vue";

const voEnrollUrl = process.env.EGI_VO_ENROLL_URL || "https://aai.egi.eu/registry/co_petitions/start/coef:643";

export default {
    name: 'Home',
    components: { IsmNavbar, Welcome, IsmModule, IsmFooter },
    data() {
        return {
            enrollUrl: voEnrollUrl,
            isAuthenticated: store.state.oidc.is_checked,
            accessToken: store.state.oidc.access_token,
        }
    },
    computed: {
        loggedIn() { return this.isAuthenticated && null != this.accessToken },
        roles() { return store.state.temp.roles; },
    },
    methods: {
        ...mapActions('oidc', [
            'authenticateOidc', // Authenticates with redirect to sign in, if not signed in
        ]),
    },
    created() {
        if(!isValid(this.roles) || 0 === this.roles.size)
            parseRoles();
    },
    mounted() {
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
    border-bottom: 1px solid #e9ecef;
    margin: 0 1rem .7rem;
}
.checkin-blue-border {
    margin: 2rem auto;
    display: flex;
    flex-wrap: nowrap;
    min-height: 3rem;
    padding-left: 4rem;
    padding-right: 1.5rem;
    border: 2px solid #005faa;
    border-radius: 100vw;
    color: #005faa;
    background-color: #fff;
    font-family: "DM Sans", sans-serif;
    font-size: 16px;
    font-weight: 700;
    background-image: url(../assets/egi-logo-color.png);
    background-position: 20px 43%;
    background-size: 32px;
    background-repeat: no-repeat;
    cursor: pointer;
}
.checkin-blue-border:hover {
    color: #fff;
    background-color: #005faa;
    background-image: url(../assets/egi-logo-white.svg);
}
.checkin-blue-border p {
  margin: auto 0;
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

.auth {
    margin: 5rem auto;
    flex-direction: column;
    max-width: 35rem;
}
.auth img {
    max-height: 10rem;
    opacity: 0.4;
}
.auth img:hover {
    opacity: 1;
}
.auth a {
    text-decoration: none;
}
</style>
