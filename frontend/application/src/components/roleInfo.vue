<template>
<div class="d-flex flex-nowrap content">
    <div class="d-flex flex-nowrap section">
        <div class="role">
            <role-header :edit-mode="false" :info="info" :bidirectional="bidirectional" :process-code="processCode"
                         @edit="editRole" @implement="confirmImplementRole" @deprecate="confirmDeprecateRole"/>
        </div>
    </div>
    <div class="d-flex flex-nowrap section">
        <div class="role">
            <div class="details">
                <h3>{{ $t('role.tasks') }}</h3>
                <vue3-markdown-it :source='tasks' />
            </div>
        </div>
    </div>
    <message id="warnDeprecateRole" ref="warnDeprecateRole" :collect-message="true" :must-collect-message="true"
             :title="$t('ims.deprecate')" title-style="danger" :message="$t('role.warnDeprecateRole')"
             :placeholder-collect-message="$t('ims.deprecateReason')"
             :confirm-button="$t('ims.continue')" @confirm="deprecateRole" />
    <message id="implementRoleDialog" ref="implementRoleDialog" :collect-message="true" :must-collect-message="true"
             :title="$t('ims.implementEntity', { entity: $t('ims.role') })"
             :message="$t('role.implementRoleChanges', { processCode: processCode, roleName: roleName })"
             :placeholder-collect-message="$t('ims.implementationDetails')"
             :confirm-button="$t('ims.implement')" @confirm="implementRole" />
    <version-history :bidirectional="bidirectional" :view-url="`/slm/roles/${this.$route.params.role}`"
                     :version-latest="latest" :version-to-show="current"
                     :filter-to-title="$t('history.implemented')"
                     :filter-to-status="Status.IMPLEMENTED.description"/>
</div>
</template>

<script>
// @ is an alias to /src
import { reactive } from 'vue';
import {store, storeProcessInfo, storeProcessRoles} from "@/store";
import { Status, isValid, userNames } from '@/utils'
import { findUserWithEmail } from "@/roles";
import MarkdownIt from 'markdown-it';
import RoleHeader from "@/components/roleHeader.vue"
import VersionHistory from "@/components/history.vue"
import Message from "@/components/message.vue";
import {implementRole} from "@/api/implementRole";
import {getRoles} from "@/api/getRoles";

var mdRender = new MarkdownIt();

export default {
    name: 'roleInfo',
    components: { RoleHeader, VersionHistory, Message },
    props: {
        processCode: String,
        apiBaseUrl: String,
        info: Object, // { current: Role, implemented: Role }
    },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            myEmail: store.state.oidc?.user?.email,
            bidirectional: reactive({ historyVisible: false }),
        }
    },
    computed: {
        Status() { return Status; },
        latest() { return store.state.ims.roleInfo; },
        current() { return this.$props.info.current; },
        implemented() { return this.$props.info.implemented; },
        roleName() { return this.current?.name; },
        tasks() {
            return isValid(this.current) && isValid(this.current.tasks) &&
                this.current.tasks.trim().length > 0 ?
                this.current.tasks :
                this.$t('ims.notSet');
        },
        returnToRoute() {
            return `/${this.$props.processCode.toLowerCase()}/roles/${this.$route.params.role}`;
        },
    },
    methods: {
        editRole() {
            this.$router.push(this.returnToRoute + "/edit");
        },
        confirmImplementRole() {
            this.$refs.implementRoleDialog.showModal();
        },
        implementRole(message) {
            // Call API to implement role
            let t = this;
            let me = findUserWithEmail(this.$props.processCode, this.myEmail);
            const riResult = implementRole(this.accessToken, this.$props.processCode, this.$route.params.role,
                                           me, message, this.$props.apiBaseUrl);
            riResult.implement().then(() => {
                if(isValid(riResult.error?.value))
                    t.$root.$refs.toasts.showError(t.$t('ims.error'), riResult.error.value);
                else {
                    console.log(`Implemented role ${t.$props.processCode}.${t.$route.params.role}`);
                    t.$root.$refs.toasts.showSuccess(t.$t('ims.success'),
                                                     t.$t('ims.implementedEntity',
                                                         { entity: t.$t('ims.role').toLowerCase() } ));

                    // Fetch the role definition from the API to include the new status
                    const rrResult = getRoles(t.accessToken, 'SLM', t.$route.params.role,
                                              t.$props.apiBaseUrl);
                    rrResult.load().then(() => {
                        storeProcessRoles(rrResult);
                        t.$router.push(t.returnToRoute + `?v=${t.latest.version}`);
                    });
                }
            });
        },
        confirmDeprecateRole() {
            this.$refs.warnDeprecateRole.showModal();
        },
        deprecateRole(message) {
            // Call API to deprecate role
            let t = this;
            let me = findUserWithEmail(this.$props.processCode, this.myEmail);
            // const pdResult = deprecateProcess(this.accessToken, this.$props.processCode, me, this.$props.apiBaseUrl);
            // pdResult.request().then(() => {
            //     if(isValid(pdResult.error?.value))
            //         t.$root.$refs.toasts.showError(t.$t('ims.error'), pdResult.error.value);
            //     else {
            //         console.log(`Deprecated the role ${this.$props.processCode}.${t.$route.params.role}`);
            //         t.$root.$refs.toasts.showSuccess(t.$t('ims.success'),
            //                                          t.$t('ims.deprecatedEntity',
            //                                              { entity: t.$t('ims.role').toLowerCase() } ));
            //
            //         // Fetch the role definition from the API to include the new status
            //         const rrResult = getRoles(t.accessToken, 'SLM', t.$route.params.role,
            //             t.$props.apiBaseUrl);
            //         rrResult.load().then(() => {
            //             storeProcessRoles(rrResult);
            //             t.$router.push(t.returnToRoute + `?v=${t.latest.version}`);
            //         });
            //     }
            // });
        },
    },
    mounted() {
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content {
    position: relative;
    gap: .5rem;
    width: 100%;
    flex-direction: column;
    justify-content: flex-start;
}

@media screen and (min-width: 765px) {
    .content {
        min-height: calc(100vh - var(--navbar-height) - var(--breadcrumb-height) - var(--footer-horizontal-height));
    }
}

.content .section {
    width: 100%;
    max-width: 60rem;
    margin: 0 auto 2rem;
}
.content .section:first-of-type {
    margin-bottom: 0;
}
.content .role {
    width: 100%;
    position: relative;
    margin: 0 auto;
}
.nav-tabs {
    width: 100%;
    max-width: 60rem;
    margin: 0 auto;
    position: relative;
    bottom: -1px;
    --bs-nav-tabs-link-active-bg: var(--bs-tertiary-bg)!important;
}
.nav-tabs .active {
    cursor: default;
}
.role .details {
    text-align: left;
    padding: 0.5rem 1rem 0;
}
.role .details h3 {
    border-bottom: 1px solid var(--bs-secondary-bg);
}
</style>
