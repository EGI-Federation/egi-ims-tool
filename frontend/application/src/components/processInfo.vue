<template>
<div class="d-flex flex-nowrap content">
    <div class="d-flex flex-nowrap section">
        <div class="process">
            <process-header :edit-mode="false" :info="info" :bidirectional="bidirectional" :process-code="processCode"
                            @update="updateProcess" @askForApproval="askForApproval"
                            @review="reviewProcess" @approve="confirmApproveProcess"
                            @reject="confirmRejectProcess" @deprecate="confirmDeprecateProcess"/>
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
        <div class="process">
            <div v-show="detailsVisible" class="details">
                <h4 v-if="!hasDescription">{{ $t('ims.description') }}</h4>
                <vue3-markdown-it v-if="hasDescription" :source='description' />
                <p v-else>{{ $t('ims.notDef') }}</p>

                <h4 id="requirements">{{ $t('process.requirements') }}</h4>
                <div class="requirements">
                    <table-control v-if="hasRequirements" id="process-requirements" ref="requirements"
                                   :header="requirementsHeader" :data="requirementsData"/>
                    <p v-else>{{ $t('ims.notDef') }}</p>
                </div>

                <h4 id="inputs-and-outputs">{{ $t('process.inputOutput') }}</h4>
                <div class="interfaces">
                    <table-control v-if="hasInterfaces" id="process-interfaces" ref="interfaces"
                                   :header="interfacesHeader" :data="interfacesData"/>
                    <p v-else>{{ $t('ims.notDef') }}</p>
                </div>
            </div>
            <div v-show="!detailsVisible" class="reviews">
                <h3>Process Reviews</h3>
                <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                <p>Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>
            </div>
        </div>
    </div>
    <message id="approveProcessDialog" ref="approveProcessDialog" :collect-message="true" :must-collect-message="false"
             :title="$t('ims.approveChange')" :message="$t('process.approveProcessChange')"
             :placeholder-collect-message="$t('ims.approvalNotes')"
             :confirm-button="$t('ims.approve')" @confirm="approveProcess" />
    <message id="rejectProcessDialog" ref="rejectProcessDialog" :collect-message="true" :must-collect-message="true"
             :title="$t('ims.rejectChange')" :message="$t('process.rejectProcessChange')"
             :placeholder-collect-message="$t('ims.rejectReason')"
             :confirm-button="$t('ims.reject')" @confirm="rejectProcess" />
    <message id="warnDeprecateProcess" ref="warnDeprecateProcess" :collect-message="true" :must-collect-message="true"
             :title="$t('ims.deprecate')" title-style="danger" :message="$t('process.warnDeprecateProcess')"
             :placeholder-collect-message="$t('ims.deprecateReason')"
             :confirm-button="$t('ims.continue')" @confirm="deprecateProcess" />
    <version-history :bidirectional="bidirectional" :view-url="`/${processCode.toLowerCase()}`"
                     :version-latest="latest" :version-to-show="current"
                     :filter-to-title="$t('history.approved')" :filter-to-status="Status.APPROVED.description"/>
</div>
</template>

<script>
// @ is an alias to /src
import { reactive } from 'vue';
import { store, storeProcessInfo } from "@/store";
import {Status, isValid, userNames, isSuccess, deepClone} from '@/utils'
import { parseInterfaces, interfaceList } from '@/process'
import { getProcess } from "@/api/getProcess";
import { markProcessReadyForApproval } from "@/api/readyForProcessApproval";
import { approveProcess } from "@/api/approveProcess";
import { deprecateProcess } from "@/api/deprecateProcess";
import MarkdownIt from 'markdown-it';
import ProcessHeader from "@/components/processHeader.vue"
import VersionHistory from "@/components/history.vue"
import TableControl, { html } from "@/components/table.vue"
import Message from "@/components/message.vue";

var mdRender = new MarkdownIt();

export default {
    name: 'processInfo',
    components: { ProcessHeader, TableControl, VersionHistory, Message },
    props: {
        processCode: String,
        apiBaseUrl: String,
        info: { // Reactive { current: Process, approved: Process }
            type: Object,
            default: () => {}
        },
    },
    expose: [ 'setupTables' ],
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            myEmail: store.state.oidc?.user?.email,
            detailsVisible: true,
            requirementsHeader: [
                this.$t('process.code'),
                {
                    name: this.$t('process.requirement'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                },
                {
                    name: this.$t('process.source'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                },
                {
                    name: this.$t('process.responsible'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(cell) : "",
                    sort: true,
                }],
            requirementsData: reactive({ rows: [] }),
            interfacesHeader: [
                this.$t('ims.type'),
                {
                    name: this.$t('process.interface'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(cell) : "",
                    sort: true,
                },
                {
                    name: this.$t('process.relevantMaterial'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                },
                {
                    name: this.$t('ims.description'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                }],
            interfacesData: reactive({ rows: [] }),
            bidirectional: reactive({ historyVisible: false }),
        }
    },
    computed: {
        Status() { return Status; },
        latest() { return store.state.ims.processInfo; },
        current() { return this.$props.info.current; },
        approved() { return this.$props.info.approved; },
        hasDescription() {
            return isValid(this.current) && isValid(this.current.description) &&
                   this.current.description.trim().length > 0;
        },
        description() {
            return this.hasDescription ? this.current.description : "";
        },
        hasRequirements() {
            return isValid(this.current) && isValid(this.current.requirements) &&
                this.current.requirements.length > 0;
        },
        requirements() {
            let r = [];
            if(isValid(this.current) && isValid(this.current.requirements)) {
                for(const req of this.current.requirements) {
                    let row = [
                        isValid(req.code) ? req.code : "",
                        isValid(req.requirement) ? req.requirement : "",
                        isValid(req.source) ? req.source : "",
                        userNames(req.responsibles, "<br/>")
                    ];
                    r.push(row);
                }
            }
            return r;
        },
        hasInterfaces() {
            return isValid(this.current) && isValid(this.current.interfaces) &&
                this.current.interfaces.length > 0;
        },
        interfaces() {
            let i = [];
            if(isValid(this.current) && isValid(this.current.interfaces)) {
                const _from = this.$t("ims.from");
                const _to = this.$t("ims.to");
                const _in = this.$t("ims.in");
                const _out = this.$t("ims.out");
                for(let itf of this.current.interfaces) {
                    let prefix = "in" === itf.direction.substr(0,2).toLowerCase() ? _from : _to;
                    const itfWith = parseInterfaces(itf.interfacesWith);
                    const itfList = interfaceList(itfWith, this.$t);
                    let row = [
                        isValid(itf.direction) && "in" === itf.direction.toLowerCase() ? _in : _out,
                        prefix + "<br/>" + itfList,
                        isValid(itf.relevantMaterial) ? itf.relevantMaterial : "",
                        isValid(itf.description) ? itf.description : ""
                    ];
                    i.push(row);
                }
            }
            return i;
        },
        returnToRoute() {
            return `/${this.processCode.toLowerCase()}`;
        },
    },
    methods: {
        setupTables() {
            this.requirementsData.rows = this.requirements;
            this.$refs.requirements?.forceUpdate();

            this.interfacesData.rows = this.interfaces;
            this.$refs.interfaces?.forceUpdate();
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
        updateProcess() {
            this.$router.push(this.returnToRoute + '/update');
        },
        askForApproval() {
            // Call API to ask for process approval
            let t = this;
            const prfaResult = markProcessReadyForApproval(this.accessToken, this.processCode, this.$props.apiBaseUrl);
            prfaResult.request().then(() => {
                if(isSuccess(t, prfaResult)) {
                    // Success
                    console.log(`Requested approval of the ${t.processCode} process`);
                    t.$root.$refs.toasts.showSuccess(t.$t('ims.success'), t.$t('process.requestedProcessApproval'));

                    // Fetch the process information from the API to include the new status
                    const piResult = getProcess(t.accessToken, t.processCode, true,
                                                    t.$props.apiBaseUrl);
                    piResult.load().then(() => {
                        if(isSuccess(t, piResult)) {
                            // Success
                            storeProcessInfo(piResult);
                            const pi = piResult.processInfo.value;
                            if(isValid(pi))
                                t.$router.push(t.returnToRoute + `?v=${pi.version}`);
                        }
                    });
                }
            });
        },
        approveOrRejectProcess(approve, message) {
            // Call API to approve/reject process changes
            let t = this;
            const apResult = approveProcess(this.accessToken, this.$props.processCode, approve, message,
                                            this.$props.apiBaseUrl);
            apResult.request().then(() => {
                if(isSuccess(t, apResult)) {
                    // Success
                    console.log(`${approve ? 'Approved' : 'Rejected'} ${t.$props.processCode} process changes`);
                    t.$root.$refs.toasts.showSuccess(t.$t('ims.success'),
                                                     t.$t(approve ? 'process.approvedProcess' : 'process.rejectedProcess'));

                    // Fetch the process information from the API to include the new status
                    const piResult = getProcess(t.accessToken, t.$props.processCode, true,
                                                    t.$props.apiBaseUrl);
                    piResult.load().then(() => {
                        if(isSuccess(t, piResult)) {
                            // Success
                            storeProcessInfo(piResult);
                            const pi = piResult.processInfo.value;
                            if(isValid(pi))
                                t.$router.push(t.returnToRoute + `?v=${pi.version}`);
                        }
                    });
                }
            });
        },
        confirmApproveProcess() {
            this.$refs.approveProcessDialog.showModal();
        },
        approveProcess(message) {
            this.approveOrRejectProcess(true, message);
        },
        confirmRejectProcess() {
            this.$refs.rejectProcessDialog.showModal();
        },
        rejectProcess(message) {
            this.approveOrRejectProcess(false, message);
        },
        confirmDeprecateProcess() {
            this.$refs.warnDeprecateProcess.showModal();
        },
        deprecateProcess(message) {
            // Call API to deprecate process
            let t = this;
            const dpResult = deprecateProcess(this.accessToken, this.$props.processCode, message,
                                              this.$props.apiBaseUrl);
            dpResult.request().then(() => {
                if(isSuccess(t, dpResult)) {
                    // Success
                    console.log(`Deprecated the ${t.$props.processCode} process`);
                    t.$root.$refs.toasts.showSuccess(t.$t('ims.success'),
                                                     t.$t('ims.deprecatedEntity', {
                                                         processCode: t.$props.processCode,
                                                         type: t.$t('ims.process').toLowerCase(),
                                                         entity: '' } ));

                    // Fetch the process information from the API to include the new status
                    const piResult = getProcess(t.accessToken, t.$props.processCode, true,
                                                    t.$props.apiBaseUrl);
                    piResult.load().then(() => {
                        if(isSuccess(t, piResult)) {
                            // Success
                            storeProcessInfo(piResult);
                            const pi = piResult.processInfo.value;
                            if(isValid(pi))
                                t.$router.push(t.returnToRoute + `?v=${pi.version}`);
                        }
                    });
                }
            });
        },
        reviewProcess() {
            this.$router.push(this.returnToRoute + '/review');
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
.content .process {
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
.process .details,
.process .reviews {
    text-align: left;
    padding: 0.5rem 1rem 0;
}
.process .details h4,
.process .reviews h4 {
    border-bottom: 1px solid var(--bs-secondary-bg);
}
.process .requirements,
.process .interfaces {
    margin-bottom: 1rem;
}
</style>
