<template>
<div class="d-flex flex-nowrap content">
    <div class="d-flex flex-nowrap section">
        <div class="process">
            <process-header :edit-mode="false" :info="info" :bidirectional="bidirectional" :process-code="processCode"
                            @configure="configureProcess" @askForApproval="askForApproval"
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
                <h3>{{ $t('ims.goals') }}</h3>
                <vue3-markdown-it :source='goals' />

                <h3>{{ $t('ims.scope') }}</h3>
                <vue3-markdown-it :source='scope' />

                <h3>{{ $t('ims.requirements') }}</h3>
                <div class="requirements">
                    <table-control v-if="hasRequirements" id="requirements" ref="requirements"
                                   :header="requirementsHeader" :data="requirementsData"/>
                    <p v-else>{{ $t('ims.notDef') }}</p>
                </div>

                <h3>{{ $t('ims.inputOutput') }}</h3>
                <div class="interfaces">
                    <table-control v-if="hasInterfaces" id="interfaces" ref="interfaces"
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
             :title="$t('ims.approveChange')" :message="$t('ims.approveProcessChange')"
             :placeholder-collect-message="$t('ims.approvalNotes')"
             :confirm-button="$t('ims.approve')" @confirm="approveProcess" />
    <message id="rejectProcessDialog" ref="rejectProcessDialog" :collect-message="true" :must-collect-message="true"
             :title="$t('ims.rejectChange')" :message="$t('ims.rejectProcessChange')"
             :placeholder-collect-message="$t('ims.rejectReason')"
             :confirm-button="$t('ims.reject')" @confirm="rejectProcess" />
    <message id="warnDeprecateProcess" ref="warnDeprecateProcess" :collect-message="true" :must-collect-message="true"
             :title="$t('ims.deprecate')" title-style="danger" :message="$t('ims.warnDeprecateProcess')"
             :placeholder-collect-message="$t('ims.deprecateReason')"
             :confirm-button="$t('ims.continue')" @confirm="deprecateProcess" />
    <version-history :bidirectional="bidirectional" :version-latest="latest" :version-to-show="current"
                     :filter-to-title="$t('history.approved')" :filter-to-status="Status.APPROVED.description"/>
</div>
</template>

<script>
// @ is an alias to /src
import { reactive } from 'vue';
import { store, storeProcessInfo } from "@/store";
import { Status, isValid, userNames } from '@/utils'
import { parseInterfaces, interfaceList } from '@/process'
import { findUserWithEmail } from "@/roles";
import { getProcessInfo } from "@/api/getProcessInfo";
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
        info: Object, // { current: Process, approved: Process }
    },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            myEmail: store.state.oidc?.user?.email,
            detailsVisible: true,
            requirementsHeader: [
                this.$t('ims.code'),
                {
                    name: this.$t('ims.requirement'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                },
                {
                    name: this.$t('ims.source'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                },
                {
                    name: this.$t('ims.responsible'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(cell) : "",
                    sort: true,
                }],
            requirementsData: reactive({ rows: [] }),
            interfacesHeader: [
                this.$t('ims.type'),
                {
                    name: this.$t('ims.interface'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(cell) : "",
                    sort: true,
                },
                {
                    name: this.$t('ims.relevantMaterial'),
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
        goals() {
            return isValid(this.current) && isValid(this.current.goals) &&
                this.current.goals.trim().length > 0 ?
                this.current.goals :
                this.$t('ims.notSet');
        },
        scope() {
            return isValid(this.current) && isValid(this.current.scope) &&
                this.current.scope.trim().length > 0 ?
                this.current.scope :
                this.$t('ims.notSet');
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
        configureProcess() {
            this.$router.push(this.returnToRoute + '/config');
        },
        askForApproval() {
            // Call API to ask for process approval
            let t = this;
            let me = findUserWithEmail(this.processCode, this.myEmail);
            const prfaResult = markProcessReadyForApproval(this.accessToken, this.processCode, me,
                                                           this.$props.apiBaseUrl);
            prfaResult.request().then(() => {
                if(isValid(prfaResult.error?.value))
                    t.$root.$refs.toasts.showError(t.$t('ims.error'), prfaResult.error.value);
                else {
                    console.log(`Requested approval of the ${this.processCode} process`);
                    t.$root.$refs.toasts.showSuccess(t.$t('ims.success'), t.$t('ims.requestedProcessApproval'));

                    // Fetch the process information from the API to include the new status
                    const piResult = getProcessInfo(this.accessToken, this.processCode, true,
                                                    this.$props.apiBaseUrl);
                    piResult.load().then(() => {
                        storeProcessInfo(piResult);
                        const pi = piResult.processInfo.value;
                        if(isValid(pi))
                            t.$router.push(this.returnToRoute + `?v=${pi.version}`);
                    });
                }
            });
        },
        approveOrRejectProcess(approve, message) {
            // Call API to approve/reject process changes
            let t = this;
            let me = findUserWithEmail(this.$props.processCode, this.myEmail);
            const paResult = approveProcess(this.accessToken, this.$props.processCode, approve, me, message,
                                            this.$props.apiBaseUrl);
            paResult.request().then(() => {
                if(isValid(paResult.error?.value))
                    t.$root.$refs.toasts.showError(t.$t('ims.error'), paResult.error.value);
                else {
                    console.log(`${approve ? 'Approved' : 'Rejected'} ${this.$props.processCode} process changes`);
                    t.$root.$refs.toasts.showSuccess(t.$t('ims.success'),
                                                     t.$t(approve ? 'ims.approvedProcess' : 'ims.rejectedProcess'));

                    // Fetch the process information from the API to include the new status
                    const piResult = getProcessInfo(this.accessToken, this.$props.processCode, true,
                                                    this.$props.apiBaseUrl);
                    piResult.load().then(() => {
                        storeProcessInfo(piResult);
                        const pi = piResult.processInfo.value;
                        if(isValid(pi))
                            t.$router.push(this.returnToRoute + `?v=${pi.version}`);
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
            let me = findUserWithEmail(this.$props.processCode, this.myEmail);
            const pdResult = deprecateProcess(this.accessToken, this.$props.processCode, me, message,
                                              this.$props.apiBaseUrl);
            pdResult.request().then(() => {
                if(isValid(pdResult.error?.value))
                    t.$root.$refs.toasts.showError(t.$t('ims.error'), pdResult.error.value);
                else {
                    console.log(`Deprecated the ${this.$props.processCode} process`);
                    t.$root.$refs.toasts.showSuccess(t.$t('ims.success'),
                                                     t.$t('ims.deprecatedEntity',
                                                         { entity: t.$t('ims.process').toLowerCase() } ));

                    // Fetch the process information from the API to include the new status
                    const piResult = getProcessInfo(this.accessToken, this.$props.processCode, true,
                                                    this.$props.apiBaseUrl);
                    piResult.load().then(() => {
                        storeProcessInfo(piResult);
                        const pi = piResult.processInfo.value;
                        if(isValid(pi))
                            t.$router.push(this.returnToRoute + `?v=${pi.version}`);
                    });
                }
            });
        },
        reviewProcess() {
            this.$router.push(this.returnToRoute + '/review');
        },
    },
    mounted() {
        let t = this;
        const delayedData = setTimeout(function() {
            if(isValid(t.current)) {
                clearTimeout(delayedData);
                t.requirementsData.rows = t.requirements;
                t.$refs.requirements?.forceUpdate();

                t.interfacesData.rows = t.interfaces;
                t.$refs.interfaces?.forceUpdate();
            }
        }, 100);
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
    max-width: 60rem;
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
.process .details h3,
.process .reviews h3 {
    border-bottom: 1px solid var(--bs-secondary-bg);
}
.process .requirements,
.process .interfaces {
    margin-bottom: 1rem;
}
</style>
