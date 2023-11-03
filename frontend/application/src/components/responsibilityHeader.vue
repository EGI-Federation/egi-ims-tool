<template>
    <div class="d-flex flex-nowrap flex-column operations">
        <button v-if="!editMode" type="button" class="btn btn-secondary text-nowrap" @click="toggleHistory">{{ $t(showHistory ? 'history.hideHistory' : 'history.showHistory') }}</button>
        <button v-if="!editMode && !isDeprecated && (isImsManager || isProcessManager)" type="button" class="btn btn-primary text-nowrap" @click="updateResponsibility">{{ $t('ims.update') }}</button>
        <button v-if="!editMode && isLatest && isDraft && (isImsManager || isProcessManager)" type="button" class="btn btn-primary text-nowrap" @click="askForApproval">{{ $t('ims.askApproval') }}</button>
        <button v-if="!editMode && isLatest && isReady && (isImsOwner || isProcessOwner)" type="button" class="btn btn-success text-nowrap" @click="approveResponsibility">{{ $t('ims.approve') }}</button>
        <button v-if="!editMode && isLatest && isReady && (isImsOwner || isProcessOwner)" type="button" class="btn btn-danger text-nowrap" @click="rejectResponsibility">{{ $t('ims.reject') }}</button>
        <button v-if="!editMode && systemProcess && isLatest && isApproved && (isImsOwner || isImsManager || isProcessManager || isProcessOwner)" type="button" class="btn btn-primary text-nowrap" @click="reviewResponsibility">{{ $t('ims.review') }}</button>
        <button v-if="!editMode && isLatest && (isImsOwner || isImsManager || isProcessOwner|| isProcessManager)" type="button" class="btn btn-primary text-nowrap" @click="addRole">{{ $t('role.addRole') }}</button>
        <button v-if="editMode" type="submit" class="btn btn-primary text-nowrap" ref="submit" :disabled="!responsibilityChanged" @click="saveChanges($event)">{{ $t('ims.saveChanges') }}</button>
        <button v-if="editMode" type="button" class="btn btn-secondary text-nowrap" @click="cancelChanges">{{ $t('ims.cancel') }}</button>
    </div>
    <div class="d-flex flex-nowrap header">
        <div class="d-flex flex-nowrap flex-column entity-title">
            <div class="entity-type">{{ $t('ims.responsibility') }}</div>
            <h2 class="fade-top-border">{{ $t('navbar.roles') }}</h2>
        </div>
    </div>
    <div class="d-flex flex-nowrap header">
        <div class="d-flex flex-nowrap info">
            <div>
                <div>{{ $t('ims.version') }} :</div>
                <div>{{ $t('ims.status') }} :</div>
                <div>{{ $t('ims.changed') }} :</div>
                <div>{{ $t('ims.approved') }} :</div>
                <div v-if="!editMode">{{ $t('ims.reviewFrequency') }} :</div>
                <div v-if="!editMode">{{ $t('ims.reviewNext') }} :</div>
            </div>
            <div>
                <div>{{ responsibilityVersion }}</div>
                <div><span :class="responsibilityStatus.pillClass">{{ responsibilityStatus.label }}</span></div>
                <div>{{ changeDate }}</div>
                <div>{{ approvalStatus }}</div>
                <div v-if="!editMode">{{ nextReview.frequency }}</div>
                <div v-if="!editMode">{{ nextReview.when }}</div>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import { store } from "@/store";
import { Status, isValid, statusPill, formatDate, formatNextEvent } from '@/utils'
import { Roles, hasRole } from "@/roles";

export default {
    name: 'responsibilityHeader',
    props: {
        processCode: String,
        info: { // Reactive { current: Responsibility, approved: Responsibility }
            type: Object,
            default: () => {}
        },
        editMode: Boolean,
        bidirectional: { // Reactive { historyVisible: Boolean, responsibilityChanged: Boolean }
            type: Object,
            default: () => {}
        },
    },
    emits: ['update', 'askForApproval', 'approve', 'reject', 'review', 'save', 'cancel'],
    expose: [ 'submit' ],
    computed: {
        latest() { return store.state.ims.responsibilityInfo; },
        current() { return this.$props.info.current; },
        approved() { return this.$props.info.approved; },
        isLatest() { return this.latest?.version === this.current?.version; },
        showHistory() { return this.$props.bidirectional?.historyVisible; },
        responsibilityChanged() { return this.$props.bidirectional?.responsibilityChanged; },
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
        responsibilityVersion() { return isValid(this.current) ? this.current.version : "?"; },
        responsibilityStatus() { return isValid(this.current) ? statusPill(this.current.status, this.$t) : {}; },
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
        systemProcess() {
            return 'IMS' === this.$props.processCode;
        },
        baseUrl() {
            return `/${this.$props.processCode.toLowerCase()}${this.systemProcess ? '/plan' : ''}/roles`;
        },
    },
    methods: {
        toggleHistory() { this.$props.bidirectional.historyVisible = !this.$props.bidirectional.historyVisible; },
        addRole() {
            this.$router.push(`${this.baseUrl}/new/edit`);
        },
        updateResponsibility() {
            this.$emit('update');
        },
        askForApproval() {
            this.$emit('askForApproval');
        },
        reviewResponsibility() {
            this.$emit('review');
        },
        approveResponsibility() {
            this.$emit('approve');
        },
        rejectResponsibility() {
            this.$emit('reject');
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
    margin-left: .5rem;
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
    min-width: 7rem;
}
.header .info .badge {
    padding-bottom: 1px!important;
}
</style>
