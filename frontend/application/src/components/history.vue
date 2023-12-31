<template>
<div v-if="showHistory" class="bg-body-secondary history-top">
    <div class="d-flex flex-nowrap gap-1">
        <h5>{{ $t('history.versionHistory') }}</h5>
        <button type="button" class="btn-close btn-close" :aria-label="$t('ims.close')" @click="closeHistory"/>
    </div>
</div>
<div v-if="showHistory" class="history bg-body-tertiary">
    <div class="d-flex flex-nowrap flex-column">
        <!-- Version filter -->
        <div v-if="filterToStatus" class="filter">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="filterHistory" v-model="applyFilter">
                <label class="form-check-label" for="filterHistory">
                    {{ $t('history.filteredOnly', { status: filterToTitle }) }}
                </label>
            </div>
            <hr/>
        </div>
        <Simplebar class="history-items">
            <!-- Latest version -->
            <div v-if="!applyFilter || !versionLatest?.status || filterToStatus === versionLatest?.status"
                 :class="'history-item' + (versionLatest?.version === versionToShow?.version ? ' current-version' : '')"
                 @click="showVersion(versionLatest?.version)">
                <div>
                    <div>{{ $t('history.version') }} {{ versionLatest?.version }} &nbsp;
                        <span :class="statusCurrent.pillClass">{{ statusCurrent.label }}</span>
                    </div>
                </div>
                <div>{{ versionLatest?.changedOn ? formatTime(versionLatest?.changedOn) : '?' }}</div>
                <div>{{ versionLatest?.changeBy ? versionLatest?.changeBy.fullName : '?' }}</div>
                <div>{{ versionLatest?.changeDescription }}</div>
                <hr/>
            </div>
            <!-- Older versions -->
            <div v-if="versionLatest && versionLatest.history && versionLatest.history.versions"
                 v-for="ver in filteredVersions" :class="'history-item' + (ver.version == versionToShow?.version ? ' current-version' : '')"
                 @click="showVersion(ver.version)">
                <div>
                    <div>{{ $t('history.version') }} {{ ver.version }} &nbsp;
                        <span :class="statusOf(ver).pillClass">{{ statusOf(ver).label }}</span>
                    </div>
                </div>
                <div>{{ ver.changedOn ? formatTime(ver.changedOn) : '?' }}</div>
                <div>{{ ver.changeBy ? ver.changeBy.fullName : '?' }}</div>
                <div>{{ ver.changeDescription }}</div>
                <hr/>
            </div>
        </Simplebar>
    </div>
</div>
</template>

<script>
// @ is an alias to /src
import { isValid, statusPill, formatTime } from '@/utils'
import Simplebar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';

export default {
    name: 'versionHistory',
    props: {
        bidirectional: { // Reactive { historyVisible: Boolean }
            type: Object,
            default: () => {}
        },
        versionLatest: Object, // Latest version of entity, with history field filled in
        versionToShow: Object, // Latest version of entity, with history field filled in
        filterToTitle: String,
        filterToStatus: String,
        viewUrl: String,
    },
    components: {
        Simplebar
    },
    data() {
        return {
            filterActive: false,
        }
    },
    computed: {
        statusCurrent() {
            return isValid(this.$props.versionLatest) ?
                   statusPill(this.$props.versionLatest.status, this.$t) : {};
        },
        showHistory: {
            get() { return this.$props.bidirectional?.historyVisible; },
            set(value) { this.$props.bidirectional.historyVisible = value; }
        },
        applyFilter: {
            get() { return isValid(this.$props.filterToStatus) && this.$data.filterActive; },
            set(value) { this.$data.filterActive = value; }
        },
        filteredVersions() {
            const allVersions = this.$props.versionLatest.history.versions;
            if(!this.applyFilter)
                return allVersions;

            const showVersions = allVersions.filter(ver => !isValid(ver.status) || ver.status === this.$props.filterToStatus);
            return showVersions;
        },
    },
    methods: {
        formatTime,
        statusOf(entity) {
            return isValid(entity) ?
                   statusPill(entity.status, this.$t) : {};
        },
        closeHistory() {
            this.showHistory = false;
        },
        showVersion(version) {
            this.$router.push(this.$props.viewUrl + `?v=${version}`);
        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.simplebar-scrollbar:before {
    background-color: #e1e5ec;
}
</style>

<style scoped>
.history-top {
    position: absolute;
    min-width: 15rem;
    max-width: 15rem;
    height: 3rem;
    top: -3rem;
    right: 0;
    align-content: center;
}
.history-top > div {
    justify-content: space-between;
    padding: .8rem 1rem;
    height: 100%;
}
.history {
    --filter-height: 2.8rem;
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    min-width: 15rem;
    max-width: 15rem;
}
.history-top,
.history {
    box-shadow: -5px 5px 10px rgb(0 0 0 / 0.15)
}
.history > div {
    height: 100%;
    overflow: hidden;
}
.history-items {
    height: calc(100% - var(--filter-height));
}
.filter {
    height: var(--filter-height);
    padding-top: .7rem;
    text-wrap: none;
}
.filter .form-check {
    display: flex;
    justify-content: center;
    padding: 0 10px 0 0;
}
.filter input[type=checkbox] {
    margin-left: .5rem;
    margin-right: .5rem;
}
.filter input[type=checkbox],
.filter label {
    cursor: pointer;
    margin-bottom: .5rem;
}
.history-item {
    padding: 1rem .5rem 0;
    text-align: left;
    font-size: smaller;
    cursor: pointer;
}
.history-item.current-version {
    cursor: default;
}
.history-item div:has(+ hr) {
    margin-top: .5rem;
    margin-bottom: .5rem;
}
.history hr {
    border: none;
    border-bottom: 1px solid rgb(93, 99, 106, .3);
    margin: 0;
}
.history-item:not(:has(+ .history-item)) hr {
    border: 0 transparent;
}
.history-item:hover {
    background-color: rgba(233, 236, 239, 0.55);
}
.history-item .badge {
    padding-bottom: 1px!important;
}
</style>
