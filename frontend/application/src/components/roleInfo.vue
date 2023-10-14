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
import { store, storeProcessRoles } from "@/store";
import { Status, isValid } from '@/utils'
import { findUserWithEmail, findUsersWithRole } from "@/roles";
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
        roleCode() {
            if(!isValid(this.current))
                return this.$route.params.role;

            return ('symbol' === typeof this.current.role) ? this.current.role.description : this.current.role;
        },
        tasks() {
            return isValid(this.current) && isValid(this.current.tasks) &&
                this.current.tasks.trim().length > 0 ?
                this.current.tasks :
                this.$t('ims.notSet');
        },
        assignees() {
            const usersWithRole = findUsersWithRole(this.$props.processCode, this.current.role);
            return isValid(usersWithRole) ? usersWithRole : new Array();
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
            const processCode = this.$props.processCode;

            let riResult = implementRole(t.accessToken, processCode, t.roleCode, me, message, t.$props.apiBaseUrl);
            riResult.logMessage = `Implemented role ${processCode}.${t.roleCode}`;
            riResult.successTitle = t.$t('ims.success');
            riResult.errorTitle = t.$t('ims.error');
            riResult.toastMessage = t.$t('ims.implementedEntity', {
                processCode: processCode,
                type: t.$t('ims.role').toLowerCase(),
                entity: ` ${t.latest.name}`
            });
            riResult.toasts = t.$root.$refs.toasts;
            riResult.implement().then(() => {
                if(isValid(riResult.error?.value)) {
                    let message = isValid(riResult.error.value.data?.description) ?
                        riResult.error.value.data.description :
                        riResult.error.value.message;
                    t.$root.$refs.toasts.showError(riResult.errorTitle, message);
                }
                else {
                    console.log(riResult.logMessage);
                    riResult.toasts.showSuccess(riResult.successTitle, riResult.toastMessage);

                    // Fetch the role definition from the API to include the new status
                    const riResult = getRoles(t.accessToken, processCode, t.roleCode, t.$props.apiBaseUrl);
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
            const processCode = this.$props.processCode;
            const roleCode = this.roleCode;
            const successTitle = t.$t('ims.success');
            const errorTitle = t.$t('ims.error');

            let rdResult = deprecateRole(t.accessToken, processCode, roleCode, me, message, t.$props.apiBaseUrl);
            rdResult.deprecate().then(() => {
                if(isValid(rdResult.error?.value)) {
                    let message = isValid(rdResult.error.value.data?.description) ?
                        rdResult.error.value.data.description :
                        rdResult.error.value.message;
                    t.$root.$refs.toasts.showError(errorTitle, message);
                }
                else {
                    console.log(`Deprecated role ${processCode}.${roleCode}`);
                    t.$root.$refs.toasts.showSuccess(successTitle, t.$t('ims.deprecatedEntity', {
                        processCode: processCode,
                        type: t.$t('ims.role').toLowerCase(),
                        entity: ` ${t.latest.roleName}`
                    }));

                    // Update UI immediately
                    t.current.status = Status.DEPRECATED.description;

                    // Revoke the role from all users
                    const roleName = t.latest.roleName;
                    let toRevoke = [];
                    for(const user of t.assignees) {
                        let rrResult = revokeRole(t.accessToken, processCode, roleCode, user.checkinUserId,
                                                  t.$props.apiBaseUrl);
                        rrResult.logMessage = `Revoked ${processCode}.${roleCode} from ${user.fullName}`;
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
                            if(isValid(rrResult.error?.value)) {
                                let message = isValid(rrResult.error.value.data?.description) ?
                                    rrResult.error.value.data.description :
                                    rrResult.error.value.message;
                                rrResult.toasts.showError(rrResult.errorTitle, message);
                            }
                            else {
                                console.log(rrResult.logMessage);
                                rrResult.toasts.showSuccess(rrResult.successTitle, rrResult.toastMessage);
                            }
                        });
                    });

                    // Wait until all API calls to revoke the role finish
                    Promise.allSettled(apiCalls).then((results) => {
                        // Fetch the role definition from the API to include the new status
                        console.log(`Role ${processCode}.${roleCode} was revoked from all users`)
                        const riResult = getRoles(t.accessToken, processCode, roleCode, t.$props.apiBaseUrl);
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
