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
import {store, storeProcessRoles} from "@/store";
import { Status, isValid } from '@/utils'
import { Roles, findUserWithEmail, getRoleByName } from "@/roles";
import { getRoles } from "@/api/getRoles";
import { implementRole } from "@/api/implementRole";
import { deprecateRole } from "@/api/deprecateRole";
import { revokeRole } from "@/api/revokeRole";
import MarkdownIt from 'markdown-it';
import RoleHeader from "@/components/roleHeader.vue"
import VersionHistory from "@/components/history.vue"
import Message from "@/components/message.vue";

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
        assignees() {
            let roleSymbol = null;
            if(isValid(this.current) && isValid(this.current.role)) {
                if("string" === typeof this.current.role)
                    this.current.role = getRoleByName(Roles[this.$props.processCode], this.current.role).role;
                roleSymbol = this.current.role;
            }
            let usersWithRole = store.state.temp?.usersByRole?.get(roleSymbol);
            return isValid(usersWithRole) ? usersWithRole : new Map();
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
                                                     t.$t('ims.implementedEntity', {
                                                         processCode: t.$props.processCode,
                                                         type: t.$t('ims.role').toLowerCase(),
                                                         entity: ` ${t.latest.name}` } ));

                    // Fetch the role definition from the API to include the new status
                    const riResult = getRoles(t.accessToken, 'SLM', t.$route.params.role,
                                              t.$props.apiBaseUrl);
                    riResult.load().then(() => {
                        storeProcessRoles(riResult);
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
            const rdResult = deprecateRole(this.accessToken, this.$props.processCode, this.$route.params.role,
                                           me, message, this.$props.apiBaseUrl);
            rdResult.deprecate().then(() => {
                if(isValid(rdResult.error?.value))
                    t.$root.$refs.toasts.showError(t.$t('ims.error'), rdResult.error.value);
                else {
                    // Update UI immediately
                    t.current.status = "DEPRECATED";

                    const processCode = t.$props.processCode;
                    const role = t.$route.params.role;
                    const roleName = t.current.name;
                    const successTitle = t.$t('ims.success');
                    const errorTitle = t.$t('ims.error');

                    console.log(`Deprecated role ${processCode}.${role}`);
                    t.$root.$refs.toasts.showSuccess(t.$t('ims.success'),
                                                     t.$t('ims.deprecatedEntity', {
                                                         processCode: processCode,
                                                         type: t.$t('ims.role').toLowerCase(),
                                                         entity: ` ${roleName}` } ));

                    // Revoke the role from all users
                    let toRevoke = [];
                    for(const user of t.assignees.values()) {
                        let rrResult = revokeRole(t.accessToken, processCode, role, user.checkinUserId,
                                                  t.$props.apiBaseUrl);
                        rrResult.logMessage = `Revoked ${processCode}.${role} from ${user.fullName}`;
                        rrResult.successTitle = successTitle;
                        rrResult.errorTitle = errorTitle;
                        rrResult.toastMessage = t.$t('role.revokedRole', {
                            processCode: processCode,
                            roleName: roleName,
                            userFullName: user.fullName
                        });
                        rrResult.toasts = t.$root.$refs.toasts;
                        toRevoke.push(rrResult);
                    }

                    let apiCalls = toRevoke.map(rrResult => {
                        return rrResult.revoke().then(() => {
                            if(isValid(rrResult.error?.value))
                                rrResult.toasts.showError(rrResult.errorTitle, rrResult.error.value);
                            else {
                                console.log(rrResult.logMessage);
                                rrResult.toasts.showSuccess(rrResult.successTitle, rrResult.toastMessage);
                            }
                        });
                    });

                    // Wait until all API calls to revoke the role finish
                    Promise.allSettled(apiCalls).then((results) => {
                        // Fetch the role definition from the API to include the new status
                        console.log(`Role ${processCode}.${role} was revoked from all users`)
                        const riResult = getRoles(t.accessToken, 'SLM', t.$route.params.role,
                                                  t.$props.apiBaseUrl);
                        riResult.load().then(() => {
                            storeProcessRoles(riResult);
                            t.$router.push(t.returnToRoute + `?v=${t.latest.version}`);
                        });
                    });
                }
            });
        },
    },
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
