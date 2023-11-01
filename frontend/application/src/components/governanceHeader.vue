<template>
    <div class="d-flex flex-nowrap flex-column operations">
        <button v-if="!editMode" type="button" class="btn btn-secondary text-nowrap" @click="toggleHistory">{{ $t(showHistory ? 'history.hideHistory' : 'history.showHistory') }}</button>
        <button v-if="!editMode && (isImsOwner || isImsManager)" type="button" class="btn btn-primary text-nowrap" @click="updateGovernance">{{ $t('ims.update') }}</button>
        <button v-if="editMode" type="submit" class="btn btn-primary text-nowrap" ref="submit" :disabled="!governanceChanged" @click="saveChanges($event)">{{ $t('ims.saveChanges') }}</button>
        <button v-if="editMode" type="button" class="btn btn-secondary text-nowrap" @click="cancelChanges">{{ $t('ims.cancel') }}</button>
    </div>
    <div class="d-flex flex-nowrap header">
        <div class="d-flex flex-nowrap flex-column entity-title">
            <div class="entity-type">{{ $t('ims.governance') }}</div>
            <h2 class="fade-top-border">{{ governanceTitle }}</h2>
        </div>
    </div>
    <div class="d-flex flex-nowrap header">
        <div class="d-flex flex-nowrap info">
            <div>
                <div>{{ $t('ims.imsOwner') }} :</div>
                <div>{{ $t('ims.imsManager') }} :</div>
                <div>{{ $t('ims.version') }} :</div>
                <div>{{ $t('ims.changed') }} :</div>
            </div>
            <div>
                <div>{{ imsOwner }}</div>
                <div>{{ imsManager }}</div>
                <div>{{ governanceVersion }}</div>
                <div>{{ changeDate }}</div>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import { store } from "@/store";
import { isValid, formatDate } from '@/utils'
import { Roles, hasRole, findUsersWithRole } from "@/roles";

export default {
    name: 'governanceHeader',
    props: {
        info: { // Reactive { current: Governance }
            type: Object,
            default: () => {}
        },
        editMode: Boolean,
        bidirectional: { // Reactive { historyVisible: Boolean, governanceChanged: Boolean }
            type: Object,
            default: () => {}
        },
    },
    emits: ['update', 'save', 'cancel'],
    expose: [ 'submit' ],
    computed: {
        latest() { return store.state.ims.governanceInfo; },
        current() { return this.$props.info.current; },
        isLatest() { return this.latest?.version === this.current?.version; },
        showHistory() { return this.$props.bidirectional?.historyVisible; },
        governanceChanged() { return this.$props.bidirectional?.governanceChanged; },
        roles() { return store.state.temp.roles; },
        isImsOwner() {
            const ims = Roles.IMS;
            return hasRole(this.roles, ims.IMS_OWNER);
        },
        isImsManager() {
            const ims = Roles.IMS;
            return hasRole(this.roles, ims.IMS_MANAGER);
        },
        governanceTitle() { return isValid(this.current) ? this.current.title : this.$t('ims.governance'); },
        governanceVersion() { return isValid(this.current) ? this.current.version : "?"; },
        imsOwner() {
            let pos = findUsersWithRole('IMS', Roles.IMS.IMS_OWNER, true);
            if(isValid(pos) && pos.length > 0) {
                let po = pos[0];
                return po.fullName;
            }
            return this.$t('ims.notSet');
        },
        imsManager() {
            let pms = findUsersWithRole('IMS', Roles.IMS.IMS_MANAGER, true);
            if(isValid(pms) && pms.length > 0) {
                let pm = pms[0];
                return pm.fullName;
            }
            return this.$t('ims.notSet');
        },
        changeDate() {
            return isValid(this.current) && isValid(this.current.changedOn) ?
                   formatDate(this.current.changedOn) : "?"; },
    },
    methods: {
        toggleHistory() { this.$props.bidirectional.historyVisible = !this.$props.bidirectional.historyVisible; },
        updateGovernance() {
            this.$emit('update');
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
}
.header .info .badge {
    padding-bottom: 1px!important;
}
</style>
