<template>
<div class="d-flex flex-nowrap content">
    <div class="d-flex flex-nowrap">
        <div class="process">
            <div class="d-flex flex-nowrap header">
                <div class="d-flex flex-nowrap flex-column operations">
                    <button type="button" class="btn btn-secondary" @click="toggleHistory">{{ $t(showHistory ? 'history.hideHistory' : 'history.showHistory') }}</button>
                    <button v-if="!isDeprecated && (isProcessOwner || isProcessManager)" type="button" class="btn btn-primary" @click="configureProcess">{{ $t('ims.configure') }}</button>
                    <button v-if="isDraft && isProcessManager" type="button" class="btn btn-primary" @click="askForApproval">{{ $t('ims.askApproval') }}</button>
                    <button v-if="isReady && isProcessOwner" type="button" class="btn btn-success" @click="approveProcess">{{ $t('ims.approve') }}</button>
                    <button v-if="isApproved && isProcessManager" type="button" class="btn btn-primary" @click="reviewProcess">{{ $t('ims.review') }}</button>
                    <button v-if="isApproved && isProcessOwner" type="button" class="btn btn-danger" @click="deprecateProcess">{{ $t('ims.deprecate') }}</button>
                </div>
                <div class="d-flex flex-nowrap flex-column">
                    <div class="entity-type">{{ $t('ims.process') }}</div>
                    <h2 class="fade-top-border">{{ processName }} ({{ processCode }})</h2>
                    <div class="d-flex flex-nowrap info">
                        <div>
                            <div>{{ $t('ims.procOwner') }} :</div>
                            <div>{{ $t('ims.procManager') }} :</div>
                            <div>{{ $t('ims.version') }} :</div>
                            <div>{{ $t('ims.status') }} :</div>
                            <div>{{ $t('ims.changed') }} :</div>
                            <div>{{ $t('ims.approved') }} :</div>
                            <div>{{ $t('ims.reviewFrequency') }} :</div>
                            <div>{{ $t('ims.reviewNext') }} :</div>
                            <div>{{ $t('ims.contact') }} :</div>
                        </div>
                        <div>
                            <div>{{ processOwner }}</div>
                            <div>{{ processManager }}</div>
                            <div>{{ processVersion }}</div>
                            <div><span :class="processStatus.pillClass">{{ processStatus.label }}</span></div>
                            <div>{{ changeDate }}</div>
                            <div>{{ approvalStatus }}</div>
                            <div>{{ nextReview.frequency }}</div>
                            <div>{{ nextReview.when }}</div>
                            <div>{{ contact }}</div>
                        </div>
                    </div>
                </div>
            </div>
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
    <version-history :visible="historyVisible" :version-to-show="latest" :filter-to-status="Status.APPROVED.description"/>
</div>
</template>

<script>
// @ is an alias to /src
import { reactive } from 'vue';
import { store } from "@/store";
import { Status, isValid, statusPill, formatDate, formatNextEvent, userNames } from '@/utils'
import { Roles, hasRole, findUsersWithRole } from "@/roles";
import { parseInterfaces, interfaceList } from '@/process'
import MarkdownIt from 'markdown-it';
import VersionHistory from "@/components/history.vue"
import TableControl, { html } from "@/components/table.vue"

var mdRender = new MarkdownIt();

export default {
    name: 'imsProcessInfo',
    components: { TableControl, VersionHistory },
    props: {
        name: String,
        info: Object, // { current: Process, approved: Process }
    },
    data() {
        return {
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
            historyVisible: reactive({ visible: false }),
        }
    },
    computed: {
        Status() { return Status; },
        latest() { return store.state.ims.slm.processInfo; },
        current() { return this.$props.info.current; },
        approved() { return this.$props.info.approved; },
        processCode() { return isValid(this.current) ? this.current.code : "SLM"; },
        processName() { return this.$t('home.' + this.processCode); },
        contact() {
            return isValid(this.current) && isValid(this.current.contact) &&
                this.current.contact.trim().length > 0 ?
                this.current.contact :
                this.$t('ims.notSet'); },
        processVersion() { return isValid(this.current) ? this.current.version : "?"; },
        processStatus() { return isValid(this.current) ? statusPill(this.current.status, this.$t) : {}; },
        processOwner() {
            let pos = findUsersWithRole(Roles.SLM.PROCESS_OWNER, true);
            if(isValid(pos) && pos.length > 0) {
                let po = pos[0];
                return po.fullName;
            }
            return this.$t('ims.notSet');
        },
        processManager() {
            let pms = findUsersWithRole(Roles.SLM.PROCESS_MANAGER, true);
            if(isValid(pms) && pms.length > 0) {
                let pm = pms[0];
                return pm.fullName;
            }
            return this.$t('ims.notSet');
        },
        changeDate() {
            return isValid(this.current) && isValid(this.current.changedOn) ?
                   formatDate(this.current.changedOn) : "?"; },
        approvalStatus() {
            if(!isValid(this.approved) ||
               !isValid(this.approved.approver))
                return this.$t('ims.no');

            let prefix = '';
            if(this.current.version !== this.approved.version)
                prefix = `${this.$t("ims.version")} ${this.approved.version} ${this.$t("ims.approvedOn")} `;

            return prefix + `${formatDate(this.approved.approvedOn)} ${this.$t("ims.by")} ${this.approved.approver.fullName}`;
        },
        nextReview() {
            return isValid(this.current) ?
                   formatNextEvent(this.current.reviewFrequency,
                                   this.current.frequencyUnit,
                                   this.current.nextReview,
                                   this.$t) : "?";
        },
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
        isDraft() { return isValid(this.current) && Status.DRAFT.description === this.current.status; },
        isApproved() { return isValid(this.current) && Status.APPROVED.description === this.current.status; },
        isReady() { return isValid(this.current) && Status.READY_FOR_APPROVAL.description === this.current.status; },
        isDeprecated() { return isValid(this.current) && Status.DEPRECATED.description === this.current.status; },
        roles() { return store.state.temp.roles; },
        isProcessOwner() { return hasRole(this.roles, Roles.SLM.PROCESS_OWNER); },
        isProcessManager() { return hasRole(this.roles, Roles.SLM.PROCESS_MANAGER); },
        showHistory() { return this.historyVisible.visible; },
    },
    methods: {
        toggleHistory() { this.historyVisible.visible = !this.historyVisible.visible; },
        configureProcess() {
            this.$router.push('/slm/config');
        },
        askForApproval() {

        },
        reviewProcess() {

        },
        approveProcess() {

        },
        deprecateProcess() {

        }
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
        }, 250);
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
.content .process .header {
    justify-content: center;
    align-content: flex-start;
    margin: 0 auto 1rem;
    position: relative;
}
.process .operations {
    gap: .2rem;
    position: absolute;
    left: 0;
    top: 0;
    padding-top: 1.8rem;
    margin-left: .5rem;
    margin-bottom: 1rem;
}
.entity-type {
    text-align: left;
    font-family: "Barlow Condensed", sans-serif;
}
.process .header h2 {
    padding-top: .5rem;
}
.fade-top-border {
    border: 1px solid;
    border-image: linear-gradient(90deg, rgba(233,236,239,1), rgba(60,74,83,0)) 1;
    border-left: none;
    border-bottom:none;
    border-right:none;
}
.process .info {
    justify-content: center;
    margin: 0 auto;
}
.process .info > div {
    flex-direction: column;
    flex-wrap: nowrap;
}
.process .info > div:nth-child(1) > div {
    color: grey;
    text-align: right;
    margin-right: .2rem;
}
.process .info > div:nth-child(2) > div {
    text-align: left;
    margin-left: .2rem;
}
.process .info > div > div {
    white-space: nowrap;
    font-size: smaller;
}
.process .info .badge {
    padding-bottom: 2px!important;
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
