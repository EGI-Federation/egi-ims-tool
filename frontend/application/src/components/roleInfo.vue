<template>
<div class="d-flex flex-nowrap content">
    <div class="d-flex flex-nowrap section">
        <div class="role">
            <role-header :edit-mode="false" :info="info" :bidirectional="bidirectional" :process-code="processCode"
                         @edit="editRole" @implement="confirmImplementRole" @deprecate="confirmDeprecateRole"/>
        </div>
    </div>
    <div class="details-logs">
        <ul class="nav nav-tabs justify-content-end">
            <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#"
                   ref="showDetails" @click="showDetails">{{ $t('ims.details') }}</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#"
                   ref="showLogs" @click="showLogs">{{ $t('role.logs') }}</a>
            </li>
        </ul>
    </div>
    <div class="d-flex flex-nowrap section">
        <div class="role">
            <div v-show="detailsVisible" class="details">
                <h3>{{ $t('role.tasks') }}</h3>
                <vue3-markdown-it :source='tasks' />
            </div>
            <div v-if="isImsOwner || isImsManager || isProcessOwner || isProcessManager"
                 v-show="!detailsVisible" class="logs">
                <h3>{{ $t('role.logsTitle') }}</h3>
                <role-log v-if="logsToday.logs.length" :title="$t('role.today')" :logs="logsToday" />
                <role-log v-if="logsYesterday.logs.length" :title="$t('role.yesterday')" :logs="logsYesterday" />
                <role-log v-if="logsFriday.logs.length" :title="$t('role.fri')" :logs="logsFriday" />
                <role-log v-if="logsThursday.logs.length" :title="$t('role.fri')" :logs="logsThursday" />
                <role-log v-if="logsWednesday.logs.length" :title="$t('role.fri')" :logs="logsWednesday" />
                <role-log v-if="logsTuesday.logs.length" :title="$t('role.fri')" :logs="logsTuesday" />
                <role-log v-if="logsMonday.logs.length" :title="$t('role.fri')" :logs="logsMonday" />
                <role-log v-if="logsThisMonth.logs.length" :title="$t('role.thisMonth')" :logs="logsMonday" />
                <role-log v-if="logsNovember.logs.length" :title="$t('role.nov')" :logs="logsNovember" />
                <role-log v-if="logsOctober.logs.length" :title="$t('role.oct')" :logs="logsOctober" />
                <role-log v-if="logsSeptember.logs.length" :title="$t('role.sep')" :logs="logsSeptember" />
                <role-log v-if="logsAugust.logs.length" :title="$t('role.aug')" :logs="logsAugust" />
                <role-log v-if="logsJuly.logs.length" :title="$t('role.jul')" :logs="logsJuly" />
                <role-log v-if="logsJune.logs.length" :title="$t('role.jun')" :logs="logsJune" />
                <role-log v-if="logsMay.logs.length" :title="$t('role.may')" :logs="logsMay" />
                <role-log v-if="logsApril.logs.length" :title="$t('role.apr')" :logs="logsApril" />
                <role-log v-if="logsMarch.logs.length" :title="$t('role.mar')" :logs="logsMarch" />
                <role-log v-if="logsFebruary.logs.length" :title="$t('role.feb')" :logs="logsFebruary" />
                <role-log v-if="logsJanuary.logs.length" :title="$t('role.jan')" :logs="logsJanuary" />
                <div v-for="[year, logs] in logsYears">
                    <role-log :title="`${strCapitalize($t('ims.year'))} ${year}`" :logs="reactive({ logs: logs })" />
                </div>
                <div v-if="!roleLogsEnd" class="more">
                    <button type="button" class="btn btn-secondary text-nowrap" @click="loadRoleLogs">{{ $t('role.loadMore') }}</button>
                </div>
                <p v-if="roleLogsEnd && 0 === roleLogs.length">{{ $t('role.noLogs') }}</p>
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
    <version-history :bidirectional="bidirectional" :view-url="`${this.baseUrl}/${this.$route.params.role}`"
                     :version-latest="latest" :version-to-show="current"
                     :filter-to-title="$t('history.implemented')"
                     :filter-to-status="Status.IMPLEMENTED.description"/>
</div>
</template>

<script>
// @ is an alias to /src
import { reactive } from 'vue';
import { store, storeProcessRoles } from "@/store";
import {Status, isValid, formatTime, getWeek, getDayOfYear, getDayOfWeek, strCapitalize, isSuccess} from '@/utils'
import {findUserWithEmail, findUsersWithRole, hasRole, Roles} from "@/roles";
import { getRoles } from "@/api/getRoles";
import { getRoleLogs } from "@/api/getRoleLogs";
import { implementRole } from "@/api/implementRole";
import { deprecateRole } from "@/api/deprecateRole";
import { revokeRole } from "@/api/revokeRole";
import MarkdownIt from 'markdown-it';
import RoleHeader from "@/components/roleHeader.vue"
import RoleLog from "@/components/roleLog.vue"
import VersionHistory from "@/components/history.vue"
import Message from "@/components/message.vue";

var mdRender = new MarkdownIt();
const logPageSize = 50;

export default {
    name: 'roleInfo',
    components: { RoleHeader, RoleLog, VersionHistory, Message },
    props: {
        processCode: String,
        pageBaseUrl: String,
        apiBaseUrl: String,
        info: { // Reactive { current: Role, implemented: Role }
            type: Object,
            default: () => {}
        },
    },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            myEmail: store.state.oidc?.user?.email,
            detailsVisible: true,
            roleLogs: [],
            roleLogsEnd: false,
            oldestRoleLogFrom: "now",
            logsToday: reactive({ logs: [] }),
            logsYesterday: reactive({ logs: [] }),
            logsFriday: reactive({ logs: [] }),
            logsThursday: reactive({ logs: [] }),
            logsWednesday: reactive({ logs: [] }),
            logsTuesday: reactive({ logs: [] }),
            logsMonday: reactive({ logs: [] }),
            logsLastWeek: reactive({ logs: [] }),
            logsThisMonth: reactive({ logs: [] }),
            logsNovember: reactive({ logs: [] }),
            logsOctober: reactive({ logs: [] }),
            logsSeptember: reactive({ logs: [] }),
            logsAugust: reactive({ logs: [] }),
            logsJuly: reactive({ logs: [] }),
            logsJune: reactive({ logs: [] }),
            logsMay: reactive({ logs: [] }),
            logsApril: reactive({ logs: [] }),
            logsMarch: reactive({ logs: [] }),
            logsFebruary: reactive({ logs: [] }),
            logsJanuary: reactive({ logs: [] }),
            logsYears: new Map(), // Map<year, logs[]>
            bidirectional: reactive({ historyVisible: false }),
        }
    },
    computed: {
        Status() { return Status; },
        baseUrl() {
            return isValid(this.$props.pageBaseUrl) ?
                this.$props.pageBaseUrl :
                `/${this.$props.processCode.toLowerCase()}/roles`;
        },
        latest() { return store.state.ims.roleInfo; },
        current() { return this.$props.info.current; },
        implemented() { return this.$props.info.implemented; },
        roleName() { return this.current?.name; },
        roleCode() {
            if(!isValid(this.current))
                return this.$route.params.role;

            return ('symbol' === typeof this.current.role) ? this.current.role.description : this.current.role;
        },
        roles() { return store.state.temp.roles; },
        isImsOwner() {
            const ims = Roles.IMS;
            return hasRole(this.roles, ims.IMS_OWNER);
        },
        isImsManager() {
            const ims = Roles.IMS;
            return hasRole(this.roles, ims.IMS_MANAGER);
        },
        isProcessOwner() {
            const roleEnum = Roles[this.$props.processCode];
            return hasRole(this.roles, roleEnum.PROCESS_OWNER);
        },
        isProcessManager() {
            const roleEnum = Roles[this.$props.processCode];
            return hasRole(this.roles, roleEnum.PROCESS_MANAGER);
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
            return `${this.baseUrl}/${this.$route.params.role}`;
        },
    },
    methods: {
        strCapitalize,
        reactive,
        showDetails(event) {
            this.detailsVisible = true;
            this.$refs['showDetails'].classList.add('active');
            this.$refs['showLogs'].classList.remove('active');
            event.preventDefault();
            event.stopPropagation();
        },
        showLogs(event) {
            if(!isValid(this.roleLogs))
                this.loadRoleLogs();

            this.detailsVisible = false;
            this.$refs['showDetails'].classList.remove('active');
            this.$refs['showLogs'].classList.add('active');
            event.preventDefault();
            event.stopPropagation();
        },
        editRole() {
            this.$router.push(this.returnToRoute + "/edit");
        },
        confirmImplementRole() {
            this.$refs.implementRoleDialog.showModal();
        },
        implementRole(message) {
            // Call API to implement role
            let t = this;
            const me = findUserWithEmail(this.$props.processCode, this.myEmail);
            const processCode = this.$props.processCode;

            let irResult = implementRole(t.accessToken, processCode, t.roleCode, me, message, t.$props.apiBaseUrl);
            irResult.logMessage = `Implemented role ${processCode}.${t.roleCode}`;
            irResult.successTitle = t.$t('ims.success');
            irResult.errorTitle = t.$t('ims.error');
            irResult.toastMessage = t.$t('ims.implementedEntity', {
                processCode: processCode,
                type: t.$t('ims.role').toLowerCase(),
                entity: ` ${t.latest.name}`
            });
            irResult.toasts = t.$root.$refs.toasts;
            irResult.implement().then(() => {
                if(isSuccess(t, irResult)) {
                    // Success
                    console.log(irResult.logMessage);
                    irResult.toasts.showSuccess(irResult.successTitle, irResult.toastMessage);

                    // Fetch the role definition from the API to include the new status
                    const riResult = getRoles(t.accessToken, processCode, t.roleCode, t.$props.apiBaseUrl);
                    riResult.load().then(() => {
                        if(isSuccess(t, riResult)) {
                            // Success
                            storeProcessRoles(riResult);
                            t.$router.push(t.returnToRoute + `?v=${t.latest.version}`);
                        }
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
            const processCode = this.$props.processCode;
            const roleCode = this.roleCode;
            const successTitle = t.$t('ims.success');
            const errorTitle = t.$t('ims.error');

            let drResult = deprecateRole(t.accessToken, processCode, roleCode, message, t.$props.apiBaseUrl);
            drResult.deprecate().then(() => {
                if(isSuccess(t, drResult)) {
                    // Success
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
                        let rrResult = revokeRole(t.accessToken, processCode, roleCode, user, t.$props.apiBaseUrl);
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
                            if(isSuccess(t, riResult)) {
                                // Success
                                storeProcessRoles(riResult);
                                t.$router.push(t.returnToRoute + `?v=${t.latest.version}`);
                            }
                        });
                    });
                }
            });
        },
        loadRoleLogs() {
            // Only load role assignment logs when viewed by process owners/managers
            if(this.isImsOwner || this.isImsManager || this.isProcessOwner || this.isProcessManager) {
                // Fetch the role assignment logs from the API
                let t = this;
                const rlResult = getRoleLogs(this.accessToken, this.$props.processCode, this.roleCode,
                    this.oldestRoleLogFrom, logPageSize, this.$props.apiBaseUrl);
                rlResult.load().then(() => {
                    if(isSuccess(t, rlResult))
                        // Success
                        t.appendRoleLogs(rlResult);
                });
            }
        },
        appendRoleLogs(rlResult) {
            if(isValid(rlResult.page)) {
                const page = rlResult.page.value;
                if(isValid(page)) {
                    if(isValid(page.elements)) {
                        if('true' === process.env.VUE_APP_IMS_TRACE_ROLES)
                            console.log(`Loaded ${page.count} assignment logs for ${this.$props.processCode}.${this.roleCode}`);

                        // Assumes log entries are in reverse chronological order (newest first)
                        const lastLog = page.elements[page.elements.length - 1];
                        this.oldestRoleLogFrom = lastLog.changedOn;
                        this.roleLogs.push(...page.elements);
                        this.roleLogsEnd = page.count < logPageSize;

                        const now = new Date();
                        const day = now.getDate();
                        const month = now.getMonth(); // 0-based
                        const year = now.getFullYear();
                        const week = getWeek(now);
                        const doy = getDayOfYear(now);

                        const yesterday = new Date(new Date().setDate(day - 1));
                        const dayY = yesterday.getDate();
                        const monthY = yesterday.getMonth(); // 0-based
                        const yearY = yesterday.getFullYear();

                        this.logsToday.logs = [];
                        this.logsYesterday.logs = [];
                        this.logsFriday.logs = [];
                        this.logsThursday.logs = [];
                        this.logsWednesday.logs = [];
                        this.logsTuesday.logs = [];
                        this.logsMonday.logs = [];
                        this.logsLastWeek.logs = [];
                        this.logsThisMonth.logs = [];
                        this.logsNovember.logs = [];
                        this.logsOctober.logs = [];
                        this.logsSeptember.logs = [];
                        this.logsAugust.logs = [];
                        this.logsJuly.logs = [];
                        this.logsJune.logs = [];
                        this.logsMay.logs = [];
                        this.logsApril.logs = [];
                        this.logsMarch.logs = [];
                        this.logsFebruary.logs = [];
                        this.logsJanuary.logs = [];
                        this.logsYears = new Map();

                        for(const log of this.roleLogs) {
                            const changedOn = new Date(log.changedOn);
                            const dayL = changedOn.getDate();
                            const monthL = changedOn.getMonth();
                            const yearL = changedOn.getFullYear();

                            // Today
                            if(day === dayL && month === monthL && year === yearL) {
                                this.logsToday.logs.push(log);
                                continue;
                            }

                            // Yesterday
                            if(dayY === dayL && monthY === monthL && yearY === yearL) {
                                this.logsYesterday.logs.push(log);
                                continue;
                            }

                            // This week
                            if(year === yearL && week === getWeek(changedOn)) {
                                const dow = getDayOfWeek(changedOn);
                                switch(dow) {
                                    case 4:
                                        this.logsFriday.logs.push(log);
                                        break;
                                    case 3:
                                        this.logsThursday.logs.push(log);
                                        break;
                                    case 2:
                                        this.logsWednesday.logs.push(log);
                                        break;
                                    case 1:
                                        this.logsTuesday.logs.push(log);
                                        break;
                                    case 0:
                                        this.logsMonday.logs.push(log);
                                        break;
                                }
                                continue;
                            }

                            // This month
                            if(month === monthL && year === yearL) {
                                this.logsThisMonth.logs.push(log);
                                continue;
                            }

                            // This year
                            if(year === yearL) {
                                switch(monthL) {
                                    case 10:
                                        this.logsNovember.logs.push(log);
                                        break;
                                    case  9:
                                        this.logsOctober.logs.push(log);
                                        break;
                                    case  8:
                                        this.logsSeptember.logs.push(log);
                                        break;
                                    case  7:
                                        this.logsAugust.logs.push(log);
                                        break;
                                    case  6:
                                        this.logsJuly.logs.push(log);
                                        break;
                                    case  5:
                                        this.logsJune.logs.push(log);
                                        break;
                                    case  4:
                                        this.logsMay.logs.push(log);
                                        break;
                                    case  3:
                                        this.logsApril.logs.push(log);
                                        break;
                                    case  2:
                                        this.logsMarch.logs.push(log);
                                        break;
                                    case  1:
                                        this.logsFebruary.logs.push(log);
                                        break;
                                    case  0:
                                        this.logsJanuary.logs.push(log);
                                        break;
                                }
                                continue;
                            }

                            // Older by year
                            let yearLogs = this.logsYears.get(yearL);
                            if(!isValid(yearLogs)) {
                                yearLogs = [];
                                this.logsYears.set(yearL, yearLogs);
                            }

                            yearLogs.push(log);
                        }
                    }
                    else
                        // No logs returned
                        this.roleLogsEnd = true;
                }
            }
        },
        logInfo(log) {
            return {
                pillClass: "badge rounded-pill " + (log.assigned ? "bg-success" : "bg-danger"),
                pillLabel: this.$t(log.assigned ? "role.assigned" : "role.revoked"),
                opDesc: `${this.$t(log.assigned ? "ims.to" : "ims.from").toLowerCase()} ${log.user.fullName} ${this.$t('ims.by')} ${log.changeBy.fullName}`,
                opTime: formatTime(log.changedOn)
            };
        }
    },
    created() {
        this.loadRoleLogs();
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
    min-height: unset;
}

@media screen and (min-width: 765px) {
    .content {
        min-height: calc(100vh - var(--navbar-height) - var(--breadcrumb-height));
    }
}

.content .section {
    width: 100%;
    max-width: calc(2rem + var(--max-content-width));
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
.content .details-logs {
    width: 100%;
    margin: 0;
    padding-left: 1rem;
    border-bottom: 1px solid #dee2e6;
    overflow: hidden;
}
.nav-tabs {
    width: 100%;
    max-width: var(--max-content-width);
    margin: 0 auto;
    position: relative;
    bottom: -1px;
    --bs-nav-tabs-link-active-bg: var(--bs-tertiary-bg)!important;
}
.nav-tabs .active {
    cursor: default;
}
.role .details,
.role .logs {
    text-align: left;
    padding: 0.5rem 1rem 0;
}
.role .details h3,
.role .logs h3 {
    border-bottom: 1px solid var(--bs-secondary-bg);
}
.more {
    margin-top: 1rem;
    text-align: center;
}
</style>
