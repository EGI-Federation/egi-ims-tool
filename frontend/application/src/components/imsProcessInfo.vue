<template>
<div class="d-flex flex-nowrap content">
    <div class="d-flex flex-nowrap">
        <div class="process">
            <ims-process-header :edit-mode="false" :info="info" :bidirectional="bidirectional"
                                @configure="configureProcess" @askForApproval="askForApproval" @review="reviewProcess"
                                @approve="confirmApproveProcess" @reject="confirmRejectProcess" @deprecate="confirmDeprecateProcess"/>
            <div class="details">
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
    <version-history :bidirectional="bidirectional" :version-latest="latest" :version-to-show="current"
                     :filter-to-status="Status.APPROVED.description"/>
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
import MarkdownIt from 'markdown-it';
import ImsProcessHeader from "@/components/imsProcessHeader.vue"
import VersionHistory from "@/components/history.vue"
import TableControl, { html } from "@/components/table.vue"
import Message from "@/components/message.vue";

var mdRender = new MarkdownIt();

export default {
    name: 'imsProcessInfo',
    components: { ImsProcessHeader, TableControl, VersionHistory, Message },
    props: {
        info: Object, // { current: Process, approved: Process }
    },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            myEmail: store.state.oidc?.user?.email,
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
        slmApi() { return process.env.IMS_SLM_API || 'http://localhost:8081'; },
        latest() { return store.state.ims.slm.processInfo; },
        current() { return this.$props.info.current; },
        approved() { return this.$props.info.approved; },
        processCode() { return isValid(this.current) ? this.current.code : "SLM"; },
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
                        prefix + itfList,
                        isValid(itf.relevantMaterial) ? itf.relevantMaterial : "",
                        isValid(itf.description) ? itf.description : ""
                    ];
                    i.push(row);
                }
            }
            return i;
        },
    },
    methods: {
        configureProcess() {
            this.$router.push('/slm/config');
        },
        askForApproval() {
            // Call API to ask for process approval
            let t = this;
            let me = findUserWithEmail(this.processCode, this.myEmail);
            const prfaResult = markProcessReadyForApproval(this.accessToken, 'SLM', me, this.slmApi);
            prfaResult.request().then(() => {
                if(isValid(prfaResult.error?.value))
                    t.$root.$refs.toasts.showError(t.$t('ims.error'), prfaResult.error.value);
                else {
                    console.log("Requested approval of the SLM process");
                    t.$root.$refs.toasts.showSuccess(t.$t('ims.success'), t.$t('ims.requestedProcessApproval'));

                    // Fetch the process information from the API to include the new status
                    const piResult = getProcessInfo(this.accessToken, 'SLM', true, this.slmApi);
                    piResult.load().then(() => {
                        storeProcessInfo('ims/slmProcessInfo', piResult);

                        const pi = piResult.processInfo.value;
                        if(isValid(pi))
                            t.$router.push(`/slm?v=${pi.version}`);
                    });
                }
            });
        },
        approveOrRejectProcess(approve, message) {
            // Call API to approve/reject process changes
            let t = this;
            let me = findUserWithEmail(this.processCode, this.myEmail);
            const paResult = approveProcess(this.accessToken, 'SLM', approve, message, me, this.slmApi);
            paResult.request().then(() => {
                if(isValid(paResult.error?.value))
                    t.$root.$refs.toasts.showError(t.$t('ims.error'), paResult.error.value);
                else {
                    console.log(`${approve ? 'Approved' : 'Rejected'} SLM process changes`);
                    t.$root.$refs.toasts.showSuccess(t.$t('ims.success'), t.$t(approve ? 'ims.approvedProcess' : 'ims.rejectedProcess'));

                    // Fetch the process information from the API to include the new status
                    const piResult = getProcessInfo(this.accessToken, 'SLM', true, this.slmApi);
                    piResult.load().then(() => {
                        storeProcessInfo('ims/slmProcessInfo', piResult);

                        const pi = piResult.processInfo.value;
                        if(isValid(pi))
                            t.$router.push(`/slm?v=${pi.version}`);
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

        },
        deprecateProcess() {

        },
        reviewProcess() {

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
<style>
.content {
    position: relative;
    gap: .5rem;
    width: 100%;
    justify-content: center;
}
.content > div {
    width: 100%;
    max-width: 60rem;
    margin: 0 auto 2rem;
}
.content .process {
    margin: 0 auto;
}
.process .details {
    text-align: left;
    padding-left: 1rem;
    padding-right: 1rem;
}
.process .details h3 {
    border-bottom: 1px solid #e9ecef;
}
.gridjs-td > span > :last-child {
    margin-bottom: 0!important;
}
.process .requirements,
.process .interfaces {
    margin-bottom: 1rem;
}
</style>
