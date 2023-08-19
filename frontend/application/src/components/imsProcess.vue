<template>
<div class="d-flex flex-nowrap content">
    <div class="d-flex flex-nowrap">
        <div class="process">
            <div class="d-flex flex-nowrap header">
                <div class="d-flex flex-nowrap flex-column operations">
                    <button type="button" class="btn btn-secondary" @click="toggleHistory">{{ $t(showHistory ? 'ims.hideHistory' : 'ims.showHistory') }}</button>
                    <button v-if="isProcessOwner || isProcessManager" type="button" class="btn btn-primary">{{ $t('ims.configure') }}</button>
                    <button v-if="isDraft && isProcessManager" type="button" class="btn btn-primary">{{ $t('ims.askApproval') }}</button>
                    <button v-if="isReady && isProcessOwner" type="button" class="btn btn-success">{{ $t('ims.approve') }}</button>
                    <button v-if="isApproved && isProcessManager" type="button" class="btn btn-primary">{{ $t('ims.review') }}</button>
                    <button v-if="isApproved && isProcessOwner" type="button" class="btn btn-danger">{{ $t('ims.deprecate') }}</button>
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
                            <div>{{ $t('ims.created') }} :</div>
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
                            <div>{{ createDate }}</div>
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
                    <div id="requirements"/>
                    <p v-if="!current.entity.requirements || 0 === current.entity.requirements.length">{{ $t('ims.notDef') }}</p>
                </div>
                <h3>{{ $t('ims.inputOutput') }}</h3>
                <div class="interfaces">
                    <div id="interfaces"/>
                    <p v-if="!current.entity.interfaces || 0 === current.entity.interfaces.length">{{ $t('ims.notDef') }}</p>
                </div>
            </div>
        </div>
    </div>
    <version-history :visible="historyVisible" :version-to-show="latest"/>
</div>
</template>

<script>
// @ is an alias to /src
import { reactive } from 'vue';
import { store } from "@/store";
import { Status, isValid, statusPill, formatDate, formatNextEvent } from '@/utils'
import { Roles, hasRole, findUsersWithRole } from "@/roles";
import VueMarkdownIt from 'vue3-markdown-it';
import MarkdownIt from 'markdown-it';
import { Grid, html } from "gridjs";
import VersionHistory from "@/components/history.vue"

var mdRender = new MarkdownIt();

export default {
    name: 'imsProcessInfo',
    components: { VersionHistory, VueMarkdownIt, Grid },
    props: {
        name: String,
        info: Object,
    },
    data() {
        return {
            requirementsGrid: new Grid(),
            requirementsHeader: [
                this.$t('ims.code'),
                {
                    name: this.$t('ims.requirement'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                },
                this.$t('ims.source'),
                {
                    name: this.$t('ims.responsible'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(cell) : "",
                    sort: true,
                }],
            interfacesGrid: new Grid(),
            interfacesHeader: [
                this.$t('ims.type'),
                {
                    name: this.$t('ims.interface'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(cell) : "",
                    sort: true,
                },
                {
                    name: this.$t('slm.relevantMaterial'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                },
                {
                    name: this.$t('ims.description'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                }],
            historyVisible: reactive({ visible: false }),
        }
    },
    computed: {
        latest() { return store.state.ims.slm.processInfo; },
        current() { return this.$props.info.current; },
        approved() { return this.$props.info.approved; },
        processCode() { return isValid(this.current) && isValid(this.current.entity) ? this.current.entity.code : "SLM"; },
        processName() { return this.$t('home.' + this.processCode); },
        contact() {
            return isValid(this.current) && isValid(this.current.entity) && isValid(this.current.entity.contact) &&
                this.current.entity.contact.trim().length > 0 ?
                this.current.entity.contact :
                this.$t('ims.notSet'); },
        processVersion() { return isValid(this.current) ? this.current.version : "?"; },
        processStatus() { return isValid(this.current) ? statusPill(this.current.entity.status, this.$t) : {}; },
        processOwner() {
            return isValid(this.current) && isValid(this.current.entity) && isValid(this.current.entity.owner) ?
                this.current.entity.owner.fullName :
                this.$t('ims.notSet');
        },
        processManager() {
            let pms = findUsersWithRole(Roles.SLM.PROCESS_MANAGER, true);
            if(isValid(pms) && pms.length > 0) {
                let pm = pms[0];
                return pm.fullName;
            }
            return this.$t('ims.notSet');
        },
        createDate() {
            return isValid(this.current) && isValid(this.current.changedOn) ?
                   formatDate(this.current.changedOn) : "?"; },
        approvalStatus() {
            if(!isValid(this.approved) ||
               !isValid(this.approved.entity) ||
               !isValid(this.approved.entity.approver))
                return this.$t('ims.no');

            let prefix = '';
            if(this.current.version !== this.approved.version)
                prefix = `${this.$t("ims.version")} ${this.approved.version} ${this.$t("ims.approvedOn")} `;

            return prefix + `${formatDate(this.approved.entity.approvedOn)} ${this.$t("ims.by")} ${this.approved.entity.approver.fullName}`;
        },
        nextReview() {
            return formatNextEvent(this.current.entity.reviewFrequency,
                                   this.current.entity.frequencyUnit,
                                   this.current.entity.nextReview,
                                   this.$t);
        },
        goals() {
            return isValid(this.current) && isValid(this.current.entity) && isValid(this.current.entity.goals) &&
                this.current.entity.goals.trim().length > 0 ?
                this.current.entity.goals :
                this.$t('ims.notSet');
        },
        scope() {
            return isValid(this.current) && isValid(this.current.entity) && isValid(this.current.entity.scope) &&
                this.current.entity.scope.trim().length > 0 ?
                this.current.entity.scope :
                this.$t('ims.notSet');
        },
        requirements() {
            let r = [];
            if(isValid(this.current) && isValid(this.current.entity) && isValid(this.current.entity.requirements)) {
                for(let req of this.current.entity.requirements) {
                    let row = [
                        isValid(req.code) ? req.code : "",
                        isValid(req.requirement) ? req.requirement : "",
                        isValid(req.source) ? req.source : ""
                    ];
                    let responsibles = "";
                    if(isValid(req.responsibles)) {
                        for(let rp of req.responsibles) {
                            if(responsibles.length > 0)
                                responsibles += ",<br/>";
                            responsibles += rp.fullName;
                        }
                    }
                    row.push(responsibles);
                    r.push(row);
                }
            }
            return r;
        },
        interfaces() {
            let i = [];
            if(isValid(this.current) && isValid(this.current.entity) && isValid(this.current.entity.interfaces)) {
                for(let itf of this.current.entity.interfaces) {
                    const _from = this.$t("slm.from");
                    const _to = this.$t("slm.to");
                    let prefix = "in" === itf.direction.substr(0,2).toLowerCase() ? _from : _to;
                    let interfacesWith = "";
                    if(isValid(itf.interfacesWith)) {
                        interfacesWith = itf.interfacesWith;
                        const itfw = interfacesWith.toLowerCase();
                        if("internal" !== itfw && "external" !== itfw)
                            interfacesWith = prefix + "<br/>" + interfacesWith;
                    }
                    let row = [
                        isValid(itf.direction) ? itf.direction : "",
                        interfacesWith,
                        isValid(itf.relevantMaterial) ? itf.relevantMaterial : "",
                        isValid(itf.description) ? itf.description : ""
                    ];
                    i.push(row);
                }
            }
            return i;
        },
        isDraft() { return isValid(this.current) && isValid(this.current.entity) && Status.DRAFT.description === this.current.entity.status; },
        isApproved() { return isValid(this.current) && isValid(this.current.entity) && Status.APPROVED.description === this.current.entity.status; },
        isReady() { return isValid(this.current) && isValid(this.current.entity) && Status.READY_FOR_APPROVAL.description === this.current.entity.status; },
        isDeprecated() { return isValid(this.current) && isValid(this.current.entity) && Status.DEPRECATED.description === this.current.entity.status; },
        roles() { return store.state.temp.roles; },
        isProcessOwner() { return hasRole(this.roles, Roles.SLM.PROCESS_OWNER); },
        isProcessManager() { return hasRole(this.roles, Roles.SLM.PROCESS_MANAGER); },
        showHistory() { return this.historyVisible.visible; },
    },
    methods: {
        toggleHistory() {
            this.historyVisible.visible = !this.historyVisible.visible;
        }
    },
    mounted() {
        // Set up the requirements grid
        this.requirementsGrid.updateConfig({
            columns: this.requirementsHeader,
            data: this.requirements,
            width: '100%',
            resizable: true
        });
        this.requirementsGrid.render(document.getElementById("requirements"));

        // Set up the interfaces grid
        this.interfacesGrid.updateConfig({
            columns: this.interfacesHeader,
            data: this.interfaces,
            width: '100%',
            resizable: true
        });
        this.interfacesGrid.render(document.getElementById("interfaces"));
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
    overflow: hidden;
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
