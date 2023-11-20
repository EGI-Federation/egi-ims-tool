<template>
<div class="d-flex flex-nowrap content">
    <div class="d-flex flex-nowrap section">
        <div class="responsibility">
            <responsibility-header :edit-mode="false" :info="info" :bidirectional="bidirectional" :process-code="processCode"
                        @update="updateResponsibility" @askForApproval="askForApproval"
                        @review="reviewResponsibility" @approve="confirmApproveResponsibility"
                        @reject="confirmRejectResponsibility"/>
        </div>
    </div>
    <div class="details-reviews">
        <ul class="nav nav-tabs justify-content-end">
            <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#"
                   ref="showDetails" @click="showDetails">{{ $t('ims.details') }}</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#"
                   ref="showReviews" @click="showReviews">{{ $t('ims.reviews') }}</a>
            </li>
        </ul>
    </div>
    <div class="d-flex flex-nowrap section">
        <div class="responsibility">
            <div v-show="detailsVisible" class="details">
                <h3 v-if="!hasDescription">{{ $t('ims.description') }}</h3>
                <vue3-markdown-it v-if="hasDescription" :source='description' :html="true"/>
                <p v-else>{{ $t('ims.notDef') }}</p>

                <h4 v-if="hasSystemRoles" id="role-category-ims">{{ $t('role.systemRoles') }}</h4>
                <div v-if="hasSystemRoles" class="d-flex flex-nowrap content">
                    <div class="section">
                        <role-summary v-for="role in systemRoleList" :role="role" :page-base-url="baseUrl"
                                      :process-code="processCode" :api-base-url="apiBaseUrl"/>
                    </div>
                </div>

                <h4 v-if="hasProcessRoles" id="role-category-process">{{ $t('role.processRoles') }}</h4>
                <div v-if="hasProcessRoles" class="d-flex flex-nowrap content">
                    <div class="section">
                        <role-summary v-for="role in processRoleList" :role="role" :page-base-url="baseUrl"
                                      :process-code="processCode" :api-base-url="apiBaseUrl"/>
                    </div>
                </div>

                <h4 v-if="hasServiceRoles" id="role-category-service">{{ $t('role.serviceRoles') }}</h4>
                <div v-if="hasServiceRoles" class="d-flex flex-nowrap content">
                    <div class="section">
                        <role-summary v-for="role in serviceRoleList" :role="role" :page-base-url="baseUrl"
                                      :process-code="processCode" :api-base-url="apiBaseUrl"/>
                    </div>
                </div>
            </div>
            <div v-show="!detailsVisible" class="reviews">
                <h3>Responsibility Reviews</h3>
                <p>
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                    labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
                    et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                    labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
                    et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                    labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
                    et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                </p>
                <p>
                    Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum
                    dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit
                    praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit
                    amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna
                    aliquam erat volutpat.
                </p>
            </div>
        </div>
    </div>
    <message id="approveDialog" ref="approveDialog" :collect-message="true" :must-collect-message="false"
             :title="$t('ims.approveChange')" :message="$t('role.approveChange')"
             :placeholder-collect-message="$t('ims.approvalNotes')"
             :confirm-button="$t('ims.approve')" @confirm="approveResponsibility" />
    <message id="rejectDialog" ref="rejectDialog" :collect-message="true" :must-collect-message="true"
             :title="$t('ims.rejectChange')" :message="$t('role.rejectChange')"
             :placeholder-collect-message="$t('ims.rejectReason')"
             :confirm-button="$t('ims.reject')" @confirm="rejectResponsibility" />
    <version-history :bidirectional="bidirectional" :view-url="this.baseUrl"
                     :version-latest="latest" :version-to-show="current"
                     :filter-to-title="$t('history.approved')" :filter-to-status="Status.APPROVED.description"/>
</div>
</template>

<script>
// @ is an alias to /src
import { reactive } from "vue";
import { store, storeProcessInfo, storeProcessResponsibilities } from "@/store";
import { Status, isValid, isSuccess } from "@/utils";
import { Roles, Category } from "@/roles";
import { notifyUsersWithRole } from "@/notify";
import { requestResponsibilityApproval } from "@/api/requestResponsibilityApproval";
import { getResponsibility } from "@/api/getResponsibility";
import { approveResponsibility } from "@/api/approveResponsibility";
import ResponsibilityHeader from "@/components/responsibilityHeader.vue";
import VersionHistory from "@/components/history.vue";
import Message from "@/components/message.vue";
import RoleSummary from "@/components/roleSummary.vue";

export default {
    name: 'responsibilityInfo',
    components: { ResponsibilityHeader, RoleSummary, VersionHistory, Message },
    props: {
        processCode: String,
        apiBaseUrl: String,
        info: { // Reactive { current: Responsibility, approved: Responsibility }
            type: Object,
            default: () => {}
        },
    },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            detailsVisible: true,
            bidirectional: reactive({ historyVisible: false }),
        }
    },
    computed: {
        Status() { return Status; },
        latest() { return store.state.ims.responsibilityInfo; },
        current() { return this.$props.info.current; },
        approved() { return this.$props.info.approved; },
        hasDescription() {
            return isValid(this.current) && isValid(this.current.description) &&
                   this.current.description.trim().length > 0;
        },
        description() {
            return this.hasDescription ? this.current.description : "";
        },
        isSystem() { return 'IMS' === this.$props.processCode; },
        baseUrl() { 
            return `/${this.$props.processCode.toLowerCase()}${this.isSystem ? '/plan' : ''}/roles`;
        },
        roles() { return store.state.temp.rolesByProcess?.get(this.$props.processCode); },
        systemRoleList() { return this.filteredRoleList(Category.IMS); },
        processRoleList() { return this.filteredRoleList(Category.PROCESS, true); },
        serviceRoleList() { return this.filteredRoleList(Category.SERVICE); },
        hasSystemRoles() {
            return this.systemRoleList.length > 0;
        },
        hasProcessRoles() {
            //return this.processRoleList.length > 0;
            return true;
        },
        hasServiceRoles() {
            return this.serviceRoleList.length > 0;
        },
    },
    methods: {
        filteredRoleList(category, includeNotCategorized = false) {
            const roleMap = this.roles;
            const allRoles = isValid(roleMap) ? Array.from(roleMap.values()) : [];
            const matchingRoles = allRoles.filter(role => {

                if(isValid(role.category)) {
                    if(category === role.category)
                        return true;
                }
                else if(includeNotCategorized)
                    return true;

                return false;
            });

            return isValid(matchingRoles) ? matchingRoles : [];
        },
        showDetails(event) {
            this.detailsVisible = true;
            this.$refs['showDetails'].classList.add('active');
            this.$refs['showReviews'].classList.remove('active');
            event.preventDefault();
            event.stopPropagation();
        },
        showReviews(event) {
            this.detailsVisible = false;
            this.$refs['showDetails'].classList.remove('active');
            this.$refs['showReviews'].classList.add('active');
            event.preventDefault();
            event.stopPropagation();
        },
        updateResponsibility() {
            const updatePath = `/${this.$props.processCode.toLowerCase()}${this.isSystem ? '/plan' : ''}/responsibilities/update`;
            this.$router.push(updatePath);
        },
        askForApproval() {
            // Call API to ask for responsibility approval
            let t = this;
            const processCode = this.$props.processCode;
            const rraResult = requestResponsibilityApproval(this.accessToken, processCode, this.$props.apiBaseUrl);
            rraResult.request().then(() => {
                if(isSuccess(t, rraResult)) {
                    // Success
                    console.log(`Requested approval of the ${processCode} process responsibilities`);
                    t.$root.$refs.toasts.showSuccess(t.$t('ims.success'), t.$t('role.requestedApproval'));

                    // Fetch responsibility from the API to include the new status
                    const riResult = getResponsibility(t.accessToken, processCode, true, t.$props.apiBaseUrl);
                    riResult.load().then(() => {
                        if(isSuccess(t, riResult)) {
                            // Success
                            storeProcessResponsibilities(riResult);
                            const ri = riResult.responsibilityInfo.value;
                            if(isValid(ri)) {
                                // Notify process owner
                                const processOwner = t.isSystem ? Roles.IMS.IMS_OWNER : Roles[processCode].PROCESS_OWNER;
                                const linkToVersion = `${t.baseUrl}?v=${ri.version}`;
                                const notification = t.$t('ims.askApprovalNotif', {
                                    process: t.$t(`home.${processCode}`),
                                    entity: ` ${t.$t('ims.responsibility').toLowerCase()}`,
                                    has: t.$t('ims.have') });
                                notifyUsersWithRole(t, processCode, processOwner.description, notification, linkToVersion);

                                // Show new version
                                t.$router.push(linkToVersion);
                            }
                        }
                    });
                }
            });
        },
        approveOrRejectResponsibility(approve, message) {
            // Call API to approve/reject responsibility changes
            let t = this;
            const processCode = this.$props.processCode;
            const arResult = approveResponsibility(this.accessToken, processCode, approve, message,
                                                   this.$props.apiBaseUrl);
            arResult.request().then(() => {
                if(isSuccess(t, arResult)) {
                    // Success
                    console.log(`${approve ? 'Approved' : 'Rejected'} ${processCode} process responsibility changes`);
                    t.$root.$refs.toasts.showSuccess(t.$t('ims.success'),
                                                     t.$t(approve ? 'role.approvedResp' : 'role.rejectedResp'));

                    // Fetch responsibility from the API to include the new status
                    const riResult = getResponsibility(t.accessToken, processCode, true, t.$props.apiBaseUrl);
                    riResult.load().then(() => {
                        if(isSuccess(t, riResult)) {
                            // Success
                            storeProcessInfo(riResult);
                            const ri = riResult.responsibilityInfo.value;
                            if(isValid(ri)) {
                                // Notify process manager
                                const processManager = t.isSystem ? Roles.IMS.IMS_MANAGER : Roles[processCode].PROCESS_MANAGER;
                                const linkToVersion = `${t.baseUrl}?v=${ri.version}`;
                                const notification = t.$t(approve ? 'ims.approvedNotif' : 'ims.rejectedNotif', {
                                    process: t.$t(`home.${processCode}`),
                                    entity: ` ${t.$t('ims.responsibility').toLowerCase()}` });
                                notifyUsersWithRole(t, processCode, processManager.description, notification, linkToVersion);

                                // Show new version
                                t.$router.push(linkToVersion);
                            }
                        }
                    });
                }
            });
        },
        confirmApproveResponsibility() {
            this.$refs.approveDialog.showModal();
        },
        approveResponsibility(message) {
            this.approveOrRejectResponsibility(true, message);
        },
        confirmRejectResponsibility() {
            this.$refs.rejectDialog.showModal();
        },
        rejectResponsibility(message) {
            this.approveOrRejectResponsibility(false, message);
        },
        reviewResponsibility() {
            this.$router.push("/ims/plan/responsibilities/review");
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
    min-height: unset;
}

@media screen and (min-width: 765px) {
    .content:first-of-type {
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
.content .responsibility {
    width: 100%;
    position: relative;
    margin: 0 auto;
}
.content .details-reviews {
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
.responsibility .details,
.responsibility .reviews {
    text-align: left;
    padding: 0.5rem 1rem 0;
}
.responsibility .details h4,
.responsibility .reviews h4 {
    margin-top: 1.5rem;
    border-bottom: 1px solid var(--bs-secondary-bg);
}
</style>
