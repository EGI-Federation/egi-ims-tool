<template>
    <div class="d-flex flex-nowrap flex-column operations">
        <button v-if="!editMode" type="button" class="btn btn-secondary text-nowrap" @click="toggleHistory">{{ $t(showHistory ? 'history.hideHistory' : 'history.showHistory') }}</button>
        <button v-if="!editMode && !isDeprecated && (isImsManager || isProcessManager)" type="button" class="btn btn-primary text-nowrap" @click="editRole">{{ $t('ims.edit') }}</button>
        <button v-if="!editMode && isLatest && isDraft && (isImsDeveloper || isProcessDeveloper)" type="button" class="btn btn-primary text-nowrap" @click="implementRole">{{ $t('ims.implement') }}</button>
        <button v-if="!editMode && isLatest && isImplemented && canDeprecate && (isImsOwner || isProcessOwner)" type="button" class="btn btn-danger text-nowrap" @click="deprecateRole">{{ $t('ims.deprecate') }}</button>
        <button v-if="editMode" type="submit" class="btn btn-primary text-nowrap" ref="submit" :disabled="!roleChanged" @click="saveChanges($event)">{{ $t('ims.saveChanges') }}</button>
        <button v-if="editMode" type="button" class="btn btn-secondary text-nowrap" @click="cancelChanges">{{ $t('ims.cancel') }}</button>
    </div>
    <div class="d-flex flex-nowrap header">
        <div class="d-flex flex-nowrap flex-column entity-title">
            <div class="entity-type">{{ $t('ims.role') }}</div>
            <h2 class="fade-top-border">{{ roleName }}</h2>
        </div>
    </div>
    <div class="d-flex flex-nowrap flex-column header">
        <div class="d-flex flex-nowrap info">
            <div>
                <div>{{ $t('ims.version') }} :</div>
                <div>{{ $t('ims.status') }} :</div>
                <div>{{ $t('ims.changed') }} :</div>
                <div>{{ $t('ims.implemented') }} :</div>
                <div>{{ $t('role.assignedTo') }} :</div>
            </div>
            <div>
                <div>{{ roleVersion }}</div>
                <div><span :class="roleStatus.pillClass">{{ roleStatus.label }}</span></div>
                <div>{{ changeDate }}</div>
                <div>{{ implementedStatus }}</div>
                <div>{{ assigneeNames }}</div>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import { store } from "@/store";
import { Status, isValid, statusPill, formatDate, userNames } from '@/utils'
import {Roles, hasRole, getRoleByName, findUsersWithRole} from "@/roles";

export default {
    name: 'processHeader',
    props: {
        processCode: String,
        info: { // Reactive { current: Role, implemented: Role }
            type: Object,
            default: () => {}
        },
        editMode: Boolean,
        bidirectional: { // Reactive { historyVisible: Boolean, roleChanged: Boolean }
            type: Object,
            default: () => {}
        },
    },
    emits: ['edit', 'implement', 'deprecate', 'save', 'cancel'],
    expose: [ 'submit' ],
    computed: {
        latest() { return store.state.ims.roleInfo; },
        current() { return this.$props.info.current; },
        implemented() { return this.$props.info.implemented; },
        isNew() { return 'new' === this.$route.params.role; },
        isLatest() { return this.latest?.version === this.current?.version; },
        showHistory() { return this.$props.bidirectional?.historyVisible; },
        roleChanged() { return this.$props.bidirectional?.roleChanged; },
        isDraft() { return isValid(this.current) && Status.DRAFT.description === this.current.status; },
        isImplemented() { return isValid(this.current) && Status.IMPLEMENTED.description === this.current.status; },
        isDeprecated() { return isValid(this.current) && Status.DEPRECATED.description === this.current.status; },
        canDeprecate() { return this.$route.params.role !== Roles[this.$props.processCode].PROCESS_STAFF.description; },
        roles() { return store.state.temp.roles; },
        assignees() {
            const usersWithRole = findUsersWithRole(this.$props.processCode, this.current?.role);
            return isValid(usersWithRole) ? usersWithRole : new Array();
        },
        assigneeNames() {
            if(this.isNew)
                return this.$t('role.nobody');

            let names = userNames(this.assignees, " ", this.$t('role.nobody'));
            return names;
        },
        isImsOwner() {
            const ims = Roles.IMS;
            return hasRole(this.roles, ims.IMS_OWNER);
        },
        isImsManager() {
            const ims = Roles.IMS;
            return hasRole(this.roles, ims.IMS_MANAGER);
        },
        isImsDeveloper() {
            const ims = Roles.IMS;
            return hasRole(this.roles, ims.IMS_DEVELOPER);
        },
        isProcessOwner() {
            const roleEnum = Roles[this.$props.processCode];
            return hasRole(this.roles, roleEnum.PROCESS_OWNER);
        },
        isProcessManager() {
            const roleEnum = Roles[this.$props.processCode];
            return hasRole(this.roles, roleEnum.PROCESS_MANAGER);
        },
        isProcessDeveloper() {
            const roleEnum = Roles[this.$props.processCode];
            return hasRole(this.roles, roleEnum.PROCESS_DEVELOPER);
        },
        roleName() { return this.current?.name; },
        roleVersion() { return isValid(this.current) ? this.current.version : "?"; },
        roleStatus() { return isValid(this.current) ? statusPill(this.current.status, this.$t) : {}; },
        changeDate() {
            return this.isNew ? this.$t("ims.now") : (
                   isValid(this.current) && isValid(this.current.changedOn) ?
                   formatDate(this.current.changedOn) : "?");
        },
        implementedStatus() {
            if(this.isNew ||
               !isValid(this.implemented) ||
               !isValid(this.implemented.changeBy))
                return this.$t('ims.no');

            let prefix = '';
            if(this.current.version !== this.implemented.version)
                prefix = `${this.$t("ims.version")} ${this.implemented.version} ${this.$t("ims.implementedOn")} `;

            return prefix + `${formatDate(this.implemented.changedOn)} ${this.$t("ims.by")} ${this.implemented.changeBy.fullName}`;
        },
    },
    methods: {
        toggleHistory() { this.$props.bidirectional.historyVisible = !this.$props.bidirectional.historyVisible; },
        editRole() {
            this.$emit('edit');
        },
        implementRole() {
            this.$emit('implement');
        },
        deprecateRole() {
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
<style scoped>
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
.entity-type {
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
}
.header .info > div:nth-child(2) > div:last-of-type {
    white-space: normal;
    min-width: 15rem;
}
.header .info .badge {
    padding-bottom: 1px!important;
}
</style>
