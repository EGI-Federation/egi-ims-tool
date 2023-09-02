<template>
    <div class="d-flex flex-nowrap header">
        <div class="d-flex flex-nowrap flex-column operations">
            <button v-if="!editMode" type="button" class="btn btn-secondary" @click="toggleHistory">{{ $t(showHistory ? 'history.hideHistory' : 'history.showHistory') }}</button>
            <button v-if="!editMode && !isDeprecated && isProcessManager" type="button" class="btn btn-primary" @click="configureProcess">{{ $t('ims.configure') }}</button>
            <button v-if="!editMode && isLatest && isDraft && isProcessManager" type="button" class="btn btn-primary" @click="askForApproval">{{ $t('ims.askApproval') }}</button>
            <button v-if="!editMode && isLatest && isReady && isProcessOwner" type="button" class="btn btn-success" @click="approveProcess">{{ $t('ims.approve') }}</button>
            <button v-if="!editMode && isLatest && isReady && isProcessOwner" type="button" class="btn btn-danger" @click="rejectProcess">{{ $t('ims.reject') }}</button>
            <button v-if="!editMode && isLatest && isApproved && (isProcessManager || isProcessOwner)" type="button" class="btn btn-primary" @click="reviewProcess">{{ $t('ims.review') }}</button>
            <button v-if="!editMode && isLatest && isApproved && isProcessOwner" type="button" class="btn btn-danger" @click="deprecateProcess">{{ $t('ims.deprecate') }}</button>
            <button v-if="editMode" type="submit" class="btn btn-primary" ref="submit" :disabled="!processChanged" @click="saveChanges($event)">{{ $t('ims.saveChanges') }}</button>
            <button v-if="editMode" type="button" class="btn btn-secondary" @click="cancelChanges">{{ $t('ims.cancel') }}</button>
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
                    <div v-if="!editMode">{{ $t('ims.reviewFrequency') }} :</div>
                    <div v-if="!editMode">{{ $t('ims.reviewNext') }} :</div>
                    <div v-if="!editMode">{{ $t('ims.contact') }} :</div>
                </div>
                <div>
                    <div>{{ processOwner }}</div>
                    <div>{{ processManager }}</div>
                    <div>{{ processVersion }}</div>
                    <div><span :class="processStatus.pillClass">{{ processStatus.label }}</span></div>
                    <div>{{ changeDate }}</div>
                    <div>{{ approvalStatus }}</div>
                    <div v-if="!editMode">{{ nextReview.frequency }}</div>
                    <div v-if="!editMode">{{ nextReview.when }}</div>
                    <div v-if="!editMode">{{ contact }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import { store } from "@/store";
import { Status, isValid, statusPill, formatDate, formatNextEvent } from '@/utils'
import { Roles, hasRole, findUsersWithRole } from "@/roles";

export default {
    name: 'imsProcessHeader',
    props: {
        info: Object,      // { current: Process, approved: Process }
        editMode: Boolean,
        bidirectional: {   // Reactive { historyVisible: Boolean, processChanged: Boolean }
            type: Object,
            default: () => {}
        },
    },
    emits: ['configure', 'askForApproval', 'approve', 'reject', 'review', 'deprecate', 'save', 'cancel'],
    expose: [ 'submit' ],
    computed: {
        latest() { return store.state.ims.slm.processInfo; },
        current() { return this.$props.info.current; },
        approved() { return this.$props.info.approved; },
        isLatest() { return this.latest?.version === this.current?.version; },
        showHistory() { return this.$props.bidirectional?.historyVisible; },
        processChanged() { return this.$props.bidirectional?.processChanged; },
        isDraft() { return isValid(this.current) && Status.DRAFT.description === this.current.status; },
        isApproved() { return isValid(this.current) && Status.APPROVED.description === this.current.status; },
        isReady() { return isValid(this.current) && Status.READY_FOR_APPROVAL.description === this.current.status; },
        isDeprecated() { return isValid(this.current) && Status.DEPRECATED.description === this.current.status; },
        roles() { return store.state.temp.roles; },
        isProcessOwner() { return hasRole(this.roles, Roles.SLM.PROCESS_OWNER); },
        isProcessManager() { return hasRole(this.roles, Roles.SLM.PROCESS_MANAGER); },
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
    },
    methods: {
        toggleHistory() { this.$props.bidirectional.historyVisible = !this.$props.bidirectional.historyVisible; },
        configureProcess() {
            this.$emit('configure');
        },
        askForApproval() {
            this.$emit('askForApproval');
        },
        reviewProcess() {
            this.$emit('review');
        },
        approveProcess() {
            this.$emit('approve');
        },
        rejectProcess() {
            this.$emit('reject');
        },
        deprecateProcess() {
            this.$emit('deprecate');
        },
        saveChanges(event) {
            this.$emit('save', event);
        },
        cancelChanges() {
            this.$emit('cancel');
        },
        submit() {
            this.$refs.submit.click();
        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.header {
    justify-content: center;
    align-content: flex-start;
    margin: 0 auto 1rem;
    position: relative;
}
.operations {
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
.header h2 {
    padding-top: .5rem;
}
.header .info {
    justify-content: center;
    margin: 0 auto;
}
.header .info > div {
    flex-direction: column;
    flex-wrap: nowrap;
}
.header .info > div:nth-child(1) > div {
    color: grey;
    text-align: right;
    margin-right: .2rem;
}
.header .info > div:nth-child(2) > div {
    text-align: left;
    margin-left: .2rem;
}
.header .info > div > div {
    white-space: nowrap;
    font-size: smaller;
}
.header .info .badge {
    padding-bottom: 2px!important;
}
</style>
