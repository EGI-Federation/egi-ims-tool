<template>
    <div class="d-flex flex-nowrap flex-column operations">
        <button v-if="!editMode" type="button" class="btn btn-secondary text-nowrap" @click="toggleHistory">{{ $t(showHistory ? 'history.hideHistory' : 'history.showHistory') }}</button>
        <button v-if="!editMode && !isDeprecated && (isImsManager || isProcessManager)" type="button" class="btn btn-primary text-nowrap" @click="updateProcess">{{ $t('ims.update') }}</button>
        <button v-if="!editMode && isLatest && isDraft && (isImsManager || isProcessManager)" type="button" class="btn btn-primary text-nowrap" @click="askForApproval">{{ $t('ims.askApproval') }}</button>
        <button v-if="!editMode && isLatest && isReady && (isImsOwner || isProcessOwner)" type="button" class="btn btn-success text-nowrap" @click="approveProcess">{{ $t('ims.approve') }}</button>
        <button v-if="!editMode && isLatest && isReady && (isImsOwner || isProcessOwner)" type="button" class="btn btn-danger text-nowrap" @click="rejectProcess">{{ $t('ims.reject') }}</button>
        <button v-if="!editMode && isLatest && isApproved && (isImsManager || isProcessManager || isImsOwner || isProcessOwner)" type="button" class="btn btn-primary text-nowrap" @click="reviewProcess">{{ $t('ims.review') }}</button>
        <button v-if="!editMode && isLatest && isApproved && (isImsOwner || isProcessOwner)" type="button" class="btn btn-danger text-nowrap" @click="deprecateProcess">{{ $t('ims.deprecate') }}</button>
        <button v-if="editMode" type="submit" class="btn btn-primary text-nowrap" ref="submit" :disabled="!processChanged" @click="saveChanges($event)">{{ $t('ims.saveChanges') }}</button>
        <button v-if="editMode" type="button" class="btn btn-secondary text-nowrap" @click="cancelChanges">{{ $t('ims.cancel') }}</button>
    </div>
    <div class="d-flex flex-nowrap header">
        <div class="d-flex flex-nowrap flex-column entity-title">
            <div class="entity-type">{{ $t('ims.process') }}</div>
            <h2 class="fade-top-border">{{ processName }} ({{ processCode }})</h2>
        </div>
    </div>
    <div class="d-flex flex-nowrap header">
        <div class="d-flex flex-nowrap info">
            <div>
                <div>{{ $t(systemProcess ? 'ims.imsOwner' : 'ims.procOwner') }} :</div>
                <div>{{ $t(systemProcess ? 'ims.imsManager' : 'ims.procManager') }} :</div>
                <div>{{ $t('ims.version') }} :</div>
                <div>{{ $t('ims.status') }} :</div>
                <div>{{ $t('ims.changed') }} :</div>
                <div>{{ $t('ims.approved') }} :</div>
                <div v-if="!editMode">{{ $t('ims.reviewFrequency') }} :</div>
                <div v-if="!editMode">{{ $t('ims.reviewNext') }} :</div>
                <div v-if="!editMode">{{ $t('ims.contact') }} :</div>
            </div>
            <div>
                <div>{{ owner }}</div>
                <div>{{ manager }}</div>
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
</template>

<script>
// @ is an alias to /src
import { store } from "@/store";
import { Status, isValid, statusPill, formatDate, formatNextEvent } from '@/utils'
import { Roles, hasRole, findUsersWithRole } from "@/roles";

export default {
    name: 'processHeader',
    props: {
        processCode: String,
        info: Object,      // { current: Process, approved: Process }
        editMode: Boolean,
        bidirectional: {   // Reactive { historyVisible: Boolean, processChanged: Boolean }
            type: Object,
            default: () => {}
        },
    },
    emits: ['update', 'askForApproval', 'approve', 'reject', 'review', 'deprecate', 'save', 'cancel'],
    expose: [ 'submit' ],
    computed: {
        latest() { return store.state.ims.processInfo; },
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
        processName() { return this.$t('home.' + this.$props.processCode); },
        systemProcess() {
            return 'IMS' === this.$props.processCode;
        },
        contact() {
            return isValid(this.current) && isValid(this.current.contact) &&
                this.current.contact.trim().length > 0 ?
                this.current.contact :
                this.$t('ims.notSet'); },
        processVersion() { return isValid(this.current) ? this.current.version : "?"; },
        processStatus() { return isValid(this.current) ? statusPill(this.current.status, this.$t) : {}; },
        owner() {
            const roleOwner = 'IMS' === this.$props.processCode ?
                Roles.IMS.IMS_OWNER :
                Roles[this.$props.processCode].PROCESS_OWNER;
            let pos = findUsersWithRole(this.$props.processCode, roleOwner, true);
            if(isValid(pos) && pos.length > 0) {
                let po = pos[0];
                return po.fullName;
            }
            return this.$t('ims.notSet');
        },
        manager() {
            const roleManager = 'IMS' === this.$props.processCode ?
                Roles.IMS.IMS_MANAGER :
                Roles[this.$props.processCode].PROCESS_MANAGER;
            let pms = findUsersWithRole(this.$props.processCode, roleManager, true);
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
               !isValid(this.approved.changeBy))
                return this.$t('ims.no');

            let prefix = '';
            if(this.current.version !== this.approved.version)
                prefix = `${this.$t("ims.version")} ${this.approved.version} ${this.$t("ims.approvedOn")} `;

            return prefix + `${formatDate(this.approved.changedOn)} ${this.$t("ims.by")} ${this.approved.changeBy.fullName}`;
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
        updateProcess() {
            this.$emit('update');
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
    margin: 0 auto;
}
.operations {
    gap: .2rem;
    position: absolute;
    left: 0;
    top: 0;
    padding-top: 1.8rem;
    margin-left: 1rem;
    margin-bottom: 1rem;
}
.header .entity-type {
    text-align: left;
    font-family: "Barlow Condensed", sans-serif;
}
.header h2 {
    padding-top: .5rem;
}
.header .info,
.header .entity-title {
    justify-content: center;
    margin: 0 auto;
}
.header .info > div {
    width: 50%!important;
    flex-direction: column;
    flex-wrap: nowrap;
}
.header .info > div:nth-child(1) > div {
    color: grey;
    text-align: right!important;
    margin-right: .2rem;
}
.header .info > div:nth-child(2) > div {
    text-align: left;
    margin-left: .2rem;
}
.header .info > div > div {
    white-space: nowrap;
    font-size: smaller;
    min-width: 7rem;
}
.header .info .badge {
    padding-bottom: 1px!important;
}
</style>
