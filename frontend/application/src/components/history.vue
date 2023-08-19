<template>
<div v-if="showHistory" class="bg-body-secondary history-top">
    <div class="d-flex flex-nowrap gap-1">
        <h5>Version History</h5>
        <button type="button" class="btn-close btn-close" aria-label="Close" @click="closeHistory"/>
    </div>
</div>
<div v-if="showHistory" class="bg-body-tertiary history">
    <div class="d-flex flex-nowrap flex-column">
        <!-- Approved only filter -->
        <!-- Latest version -->
        <div class="history-item" @click="showVersion(versionToShow.version)">
            <div>
                <div>{{ $t('ims.version') }} {{ versionToShow.version }} &nbsp;
                    <span :class="statusCurrent.pillClass">{{ statusCurrent.label }}</span>
                </div>
            </div>
            <div>{{ versionToShow.changedOn ? formatTime(versionToShow.changedOn) : '?' }}</div>
            <div>{{ versionToShow.changeBy }}</div>
            <div>{{ versionToShow.changeDescription }}</div>
            <hr/>
        </div>
        <!-- Older versions -->
        <div v-if="versionToShow.entity && versionToShow.entity.history && versionToShow.entity.history.versions"
             v-for="ver in versionToShow.entity.history.versions" class="history-item" @click="showVersion(ver.version)">
            <div>
                <div>{{ $t('ims.version') }} {{ ver.version }} &nbsp;
                    <span :class="statusOf(ver.entity).pillClass">{{ statusOf(ver.entity).label }}</span>
                </div>
            </div>
            <div>{{ ver.changedOn ? formatTime(ver.changedOn) : '?' }}</div>
            <div>{{ ver.changeBy }}</div>
            <div>{{ ver.changeDescription }}</div>
            <hr/>
        </div>
    </div>
</div>
</template>

<script>
// @ is an alias to /src
import { Status, isValid, statusPill, formatTime } from '@/utils'

export default {
    name: 'versionHistory',
    props: {
        visible: {
            type: Object,
            default: () => {}
        },
        versionToShow: Object, // Version<T>
    },
    computed: {
        statusCurrent() {
            return isValid(this.$props.versionToShow.entity) ?
                   statusPill(this.$props.versionToShow.entity.status, this.$t) : {};
        },
        showHistory: {
            get() { return this.$props.visible.visible; },
            set(value) { this.$props.visible.visible = value; }
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
            this.$router.push({ name: 'slm-home', query: { v: version } })
        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    min-width: 15rem;
    max-width: 15rem;
    overflow-y: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
}
.history::-webkit-scrollbar { /* WebKit */
    width: 0;
    height: 0;
}
.history-top,
.history {
    box-shadow: -5px 5px 10px rgb(0 0 0 / 0.15)
}
.history-item {
    padding: 1rem .5rem 0;
    text-align: left;
    font-size: smaller;
    cursor: pointer;
}
.history-item div:nth-child(4) {
    margin-top: .5rem;
}
.history-item hr {
    border: none;
    border-bottom: 1px solid rgb(93, 99, 106, .3);
    margin-top: 1rem;
    margin-bottom: 0;
}
.history-item:not(:has(+ .history-item)) hr {
    border: 0 transparent;
}
.history-item:hover {
    background-color: rgba(233, 236, 239, 0.55);
}
.history-item .badge {
    padding-bottom: 2px!important;
}
</style>
