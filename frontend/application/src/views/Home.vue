<template>
<ims-navbar v-if="loggedIn"/>
    <div class="page-container">
        <div class="page">
          <welcome/>
            <div v-if="loggedIn" class="home">
                <div v-if="canUseTool" class="greet">{{ $t('navbar.processes') }}</div>
                <div v-if="canUseTool" class="d-flex flex-wrap ism-modules">
                    <ism-module
                        :title="$t('home.BA')"
                        code="BA"
                        :icon="Icons.BA"
                        :color="Colors.BA"
                    />
                    <ism-module
                        :title="$t('home.BDS')"
                        code="BDS"
                        :icon="Icons.BDS"
                        :color="Colors.BDS"
                    />
                    <ism-module
                        :title="$t('home.CAPM')"
                        code="CAPM"
                        :icon="Icons.CAPM"
                        :color="Colors.CAPM"
                    />
                    <ism-module
                        :title="$t('home.CHM')"
                        code="CHM"
                        :icon="Icons.CHM"
                        :color="Colors.CHM"
                    />
                    <ism-module
                        :title="$t('home.COM')"
                        code="COM"
                        :icon="Icons.COM"
                        :color="Colors.COM"
                    />
                    <ism-module
                        :title="$t('home.CONFM')"
                        code="CONFM"
                        :icon="Icons.CONFM"
                        :color="Colors.CONFM"
                    />
                    <ism-module
                        :title="$t('home.CSI')"
                        code="CSI"
                        :icon="Icons.CSI"
                        :color="Colors.CSI"
                    />
                    <ism-module
                        :title="$t('home.CRM')"
                        code="CRM"
                        :icon="Icons.CRM"
                        :color="Colors.CRM"
                    />
                    <ism-module
                        :title="$t('home.CPM')"
                        code="CPM"
                        :icon="Icons.CPM"
                        :color="Colors.CPM"
                    />
                    <ism-module
                        :title="$t('home.FA')"
                        code="FA"
                        :icon="Icons.FA"
                        :color="Colors.FA"
                    />
                    <ism-module
                        :title="$t('home.HR')"
                        code="HR"
                        :icon="Icons.HR"
                        :color="Colors.HR"
                    />
                    <ism-module
                        :title="$t('home.ISM')"
                        code="ISM"
                        :icon="Icons.ISM"
                        :color="Colors.ISM"
                    />
                    <ism-module
                        :title="$t('home.ISRM')"
                        code="ISRM"
                        :icon="Icons.ISRM"
                        :color="Colors.ISRM"
                    />
                    <ism-module
                        :title="$t('home.PPC')"
                        code="PPC"
                        :icon="Icons.PPC"
                        :color="Colors.PPC"
                    />
                    <ism-module
                        :title="$t('home.PM')"
                        code="PM"
                        :icon="Icons.PM"
                        :color="Colors.PM"
                    />
                    <ism-module
                        :title="$t('home.PKM')"
                        code="PKM"
                        :icon="Icons.PKM"
                        :color="Colors.PKM"
                    />
                    <ism-module
                        :title="$t('home.PPM')"
                        code="PPM"
                        :icon="Icons.PPM"
                        :color="Colors.PPM"
                    />
                    <ism-module
                        :title="$t('home.RDM')"
                        code="RDM"
                        :icon="Icons.RDM"
                        :color="Colors.RDM"
                    />
                    <ism-module
                        :title="$t('home.RM')"
                        code="RM"
                        :icon="Icons.RM"
                        :color="Colors.RM"
                    />
                    <ism-module
                        :title="$t('home.SACM')"
                        code="SACM"
                        :icon="Icons.SACM"
                        :color="Colors.SACM"
                    />
                    <ism-module
                        :title="$t('home.SUPPM')"
                        code="SUPPM"
                        :icon="Icons.SUPPM"
                        :color="Colors.SUPPM"
                    />
                    <ism-module
                        :title="$t('home.SLM')"
                        code="SLM"
                        :icon="Icons.SLM"
                        :color="Colors.SLM"
                        active=true
                    />
                    <ism-module
                        :title="$t('home.SPM')"
                        code="SPM"
                        :icon="Icons.SPM"
                        :color="Colors.SPM"
                    />
                    <ism-module
                        :title="$t('home.SRM')"
                        code="SRM"
                        :icon="Icons.SRM"
                        :color="Colors.SRM"
                    />
                </div>
                <p v-else class="must-enroll">
                    {{ $t('home.voMember') }}
                    {{ $t('home.requestEnroll') }} <a :href="enrollUrl" target="_blank">{{ $t('home.clickingHere') }}</a>.
                </p>
            </div>
            <div v-if="!loggedIn" class="d-flex flex-nowrap auth">
                <p class="mb-0">{{ $t('home.needAuth') }}</p>
                <p class="mb-2">{{ $t('home.clickAuth') }}</p>
                <div class="checkin-blue-border" @click="authenticateOidc"><p>{{ $t('home.signIn') }}</p></div>
                <p class="mt-2 ">
                    <b>{{ $t('home.pleaseNote') }}</b>: {{ $t('home.voMember') }}
                    {{ $t('home.requestEnroll') }} <a :href="enrollUrl" target="_blank">{{ $t('home.clickingHere') }}</a>.
                </p>
            </div>
        </div>
        <ims-footer/>
    </div>
</template>

<script>
// @ is an alias to /src
import { isValid } from "@/utils";
import { Roles, hasRole, parseRoles, rolesFromEntitlements } from "@/roles";
import { Icons, IconColors } from "@/notify";
import { store } from "@/store";
import { mapActions } from "vuex";
import imsNavbar from "@/components/navbar.vue";
import Welcome from "@/components/welcome.vue";
import IsmModule from "@/components/imsModule.vue";
import imsFooter from "@/components/footer.vue";

export default {
    name: 'Home',
    components: { imsNavbar, Welcome, IsmModule, imsFooter },
    props: {
        toasts: Element,
    },
    data() {
        return {
            enrollUrl: process.env.VUE_APP_EGI_VO_ENROLL_URL,
            isAuthenticated: store.state.oidc.is_checked,
            accessToken: store.state.oidc.access_token,
        }
    },
    computed: {
        Icons() { return Icons; },
        Colors() { return IconColors; },
        loggedIn() { return this.isAuthenticated && null != this.accessToken },
        roles() { return store.state.temp.roles; },
        canUseTool() { return hasRole(this.roles, Roles.VO.MEMBER); },
    },
    methods: {
        ...mapActions('oidc', [
            'authenticateOidc', // Authenticates with redirect to sign in, if not signed in
        ]),
    },
    created() {
        if(!isValid(this.roles) || 0 === this.roles.size)
            parseRoles();

        if('true' === process.env.VUE_APP_IMS_TRACE_APIS) {
            console.log(`IMS API at ${process.env.VUE_APP_IMS_IMS_API}`);
            console.log(`MSG API at ${process.env.VUE_APP_IMS_MSG_API}`);
            console.log(`SLM API at ${process.env.VUE_APP_IMS_SLM_API}`);
        }
    },
    mounted() {
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
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
.must-enroll {
    max-width: 35rem;
    text-align: center;
    margin: 5rem auto;
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
