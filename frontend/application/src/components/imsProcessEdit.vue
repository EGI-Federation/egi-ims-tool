<template>
<div class="d-flex flex-nowrap content">
    <div class="d-flex flex-nowrap">
        <div class="process">
            <div class="d-flex flex-nowrap header">
                <div class="d-flex flex-nowrap flex-column operations">
                    <button v-if="isProcessManager || isProcessOwner" type="button" class="btn btn-primary" @click="saveChanges">{{ $t('ims.saveChanges') }}</button>
                    <button type="button" class="btn btn-secondary" @click="cancelChanges">{{ $t('ims.cancel') }}</button>
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
                        </div>
                        <div>
                            <div>{{ processOwner }}</div>
                            <div>{{ processManager }}</div>
                            <div>{{ processVersion }}</div>
                            <div><span :class="processStatus.pillClass">{{ processStatus.label }}</span></div>
                            <div>{{ createDate }}</div>
                            <div>{{ approvalStatus }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="details">
                <h3>{{ $t('ims.general') }}</h3>
                <div>Review frequency</div>

                <h3>{{ $t('ims.goals') }}</h3>
                <textbox-with-preview :label="$t('ims.goalsLabel')" :text="goalsEditor" :highlight="true"/>

                <h3>{{ $t('ims.scope') }}</h3>
                <textbox-with-preview :label="$t('ims.scopeLabel')" :text="scopeEditor" rows="10" :highlight="true"/>

                <h3>{{ $t('ims.requirements') }}</h3>
                <div class="requirements">
                    <div id="requirements"/>
                    <p v-if="!edited.entity.requirements || 0 === edited.entity.requirements.length">{{ $t('ims.notDef') }}</p>
                </div>
                <h3>{{ $t('ims.inputOutput') }}</h3>
                <div class="interfaces">
                    <div id="interfaces"/>
                    <p v-if="!edited.entity.interfaces || 0 === edited.entity.interfaces.length">{{ $t('ims.notDef') }}</p>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
// @ is an alias to /src
import { store } from "@/store";
import { Status, isValid, deepClone, statusPill, formatDate, formatNextEvent } from '@/utils'
import { Roles, hasRole, findUsersWithRole } from "@/roles";
import { Grid, html } from "gridjs";
import MarkdownIt from 'markdown-it';
import TextboxWithPreview from "@/components/textboxPreview.vue"
import { reactive } from "vue";

var mdRender = new MarkdownIt();

export default {
    name: 'imsProcessEdit',
    components: { TextboxWithPreview, Grid },
    props: {
        name: String,
        info: Object,
    },
    data() {
        return {
            processInfo: null, // Version<Process>
            goalsEditor: reactive({ text: isValid(this.edited) && isValid(this.edited.entity) ? this.edited.entity.goals : "" }),
            scopeEditor: reactive({ text: isValid(this.edited) && isValid(this.edited.entity) ? this.edited.entity.scope : "" }),
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
        }
    },
    computed: {
        current() { return this.$props.info.current; },
        approved() { return this.$props.info.approved; },
        edited() {
            if(!isValid(this.processInfo) && isValid(this.current)) {
                this.processInfo = deepClone(this.current);
                this.goalsEditor.text = this.processInfo.entity.goals;
                this.scopeEditor.text = this.processInfo.entity.scope;
            }

            return this.processInfo;
        },
        processCode() { return isValid(this.edited) && isValid(this.edited.entity) ? this.edited.entity.code : "SLM"; },
        processName() { return this.$t('home.' + this.processCode); },
        contact() {
            return isValid(this.edited) && isValid(this.edited.entity) && isValid(this.edited.entity.contact) &&
                this.edited.entity.contact.trim().length > 0 ?
                this.edited.entity.contact :
                this.$t('ims.notSet'); },
        processVersion() { return isValid(this.edited) ? this.edited.version : "?"; },
        processStatus() { return isValid(this.edited) && isValid(this.edited.entity) ? statusPill(this.edited.entity.status, this.$t) : {}; },
        processOwner() {
            return isValid(this.edited) && isValid(this.edited.entity) && isValid(this.edited.entity.owner) ?
                this.edited.entity.owner.fullName :
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
            return isValid(this.edited) && isValid(this.edited.changedOn) ?
                   formatDate(this.edited.changedOn) : "?"; },
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
            return isValid(this.current) && isValid(this.current.entity) ?
                   formatNextEvent(this.edited.entity.reviewFrequency,
                                   this.edited.entity.frequencyUnit,
                                   this.edited.entity.nextReview,
                                   this.$t) : "?";
        },
        requirements() {
            let r = [];
            if(isValid(this.edited) && isValid(this.edited.entity) && isValid(this.edited.entity.requirements)) {
                for(let req of this.edited.entity.requirements) {
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
            if(isValid(this.edited) && isValid(this.edited.entity) && isValid(this.edited.entity.interfaces)) {
                for(let itf of this.edited.entity.interfaces) {
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
        isDraft() { return isValid(this.edited) && isValid(this.edited.entity) && Status.DRAFT.description === this.edited.entity.status; },
        isApproved() { return isValid(this.edited) && isValid(this.edited.entity) && Status.APPROVED.description === this.edited.entity.status; },
        isReady() { return isValid(this.edited) && isValid(this.edited.entity) && Status.READY_FOR_APPROVAL.description === this.edited.entity.status; },
        isDeprecated() { return isValid(this.edited) && isValid(this.edited.entity) && Status.DEPRECATED.description === this.edited.entity.status; },
        roles() { return store.state.temp.roles; },
        isProcessOwner() { return hasRole(this.roles, Roles.SLM.PROCESS_OWNER); },
        isProcessManager() { return hasRole(this.roles, Roles.SLM.PROCESS_MANAGER); },
    },
    methods: {
        saveChanges() {

        },
        cancelChanges() {
            this.$router.push('/slm');
        },
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
    },
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
